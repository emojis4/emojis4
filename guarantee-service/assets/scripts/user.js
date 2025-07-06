import {siteLink} from './config.js';
const isLogined = localStorage.getItem('apiKey');
const login = localStorage.getItem('login');

function showProfile(){
    const time = new Date();
    let [dd, mm, yy] = [time.getDate(), time.getMonth(), time.getFullYear()];
    if(dd < 10){dd = '0' + dd;}
    if(mm < 10){mm = '0' + mm;}
    const avatar = document.getElementById('avatar');
    const avatar2 = document.getElementById('avatar2');
    fetch(siteLink + "/backend/profile?key=" + isLogined, {method: 'GET', mode:'cors'}).then(gotData => gotData.json())
.then(response => {
    const avatarLink = response?.user?.avatar;
    document.getElementById('level').textContent = response?.user?.level + ' Уровень';
    document.getElementById('login').textContent = response?.user?.login;
    document.getElementById('balance').textContent = response?.user?.balance + '₽';
    document.getElementById('dealsCount').textContent = response?.deal?.dealsCount;
    document.getElementById('successDeals').textContent = response?.deal?.successDeals;
    document.getElementById('cancelDeals').textContent = response?.deal?.cancelDeals;
    document.getElementById('reviewAverage').textContent = response?.review?.reviewAverage ?? 0;
    document.getElementById('todayDate').textContent = response?.user?.holds + '₽';
    if(avatarLink){
        avatar.src = avatarLink;
        avatar2.src = avatarLink;
    }
    document.getElementById('todayDate2').textContent = response?.user?.holds + '₽';
    document.getElementById('level2').textContent = response?.user?.level + ' Уровень';
    document.getElementById('login2').textContent = response?.user?.login;
    document.getElementById('dealsCount2').textContent = response?.deal?.dealsCount;
    document.getElementById('successDeals2').textContent = response?.deal?.successDeals;
    document.getElementById('cancelDeals2').textContent = response?.deal?.cancelDeals;
    document.getElementById('reviewAverage2').textContent = response?.review?.reviewAverage ?? 0;
    document.getElementById('balance2').textContent = response?.user?.balance + '₽';
    document.getElementById('friendLink').textContent = siteLink + '/createdeal?username=' + response?.user?.login;
    document.getElementById('deals-link').href = siteLink + '/info?q=deals&username=' + login;
    document.getElementById('reviews-link').href = siteLink + '/info?q=reviews&username=' + login;
    for(let starNumber = 1; starNumber <= +response?.review?.reviewAverage; starNumber++){
        const currentStar = document.querySelector(`.star${starNumber}`);
        currentStar.classList.remove('starGray');
        currentStar.classList.add('starYellow');
    }
    showDealRequests(response.wait);
    showDeals(response.deal.allDeals);
    showReviews(response.review.allReviews);
    removePreloads();
}).catch(error => {
    console.log(error);
});
}

function showDealRequests(allRequests){
    const dealRequestsWrapper = document.getElementById('dealRequets__wrapper');
    let flag = false;
    if(allRequests){
        for(let dealRequestInfo of Object.values(allRequests)){
            const time = new Date(dealRequestInfo?.date * 1000);
            let [dd, mm, yy] = [time.getDate(), time.getMonth(), time.getFullYear()];
            if(dd < 10){dd = '0' + dd;}
            if(mm < 10){mm = '0' + mm;}
            flag = true;
            const [customer, seller] = [dealRequestInfo?.user_customer, dealRequestInfo?.user_seller];
            dealRequestsWrapper.innerHTML += `
        <div class="deal__item">
            <h3 class="l-header">${dealRequestInfo?.title}</h3>
            <div class="deal__item__info1">
                <span class="p-paragraph deal__usernamefrom">Сделка с <a href="/user/?username=${seller != login ? seller : customer}">${seller != login ? seller : customer}</a></span>
                <span class="p-paragraph">${mm}.${dd}.${yy}</span>
            </div>
            <div class="deal__item__info2">
                <span class="deal__price">${dealRequestInfo?.price}₽</span>
            </div>
            <div>
            <span class="dealRequest__button green-background acceptDeal-btn" deal-id="${dealRequestInfo?.id}">Принять</span>
            <span class="dealRequest__button red-background cancelDeal-btn" deal-id="${dealRequestInfo?.id}">Отменить</span>
        </div>
        </div>`;
        }
    }
    for(let acceptDealBtn of document.querySelectorAll('.acceptDeal-btn')){
        acceptDealBtn.addEventListener('click', acceptDeal);
    }
    for(let cancelDealBtn of document.querySelectorAll('.cancelDeal-btn')){
        cancelDealBtn.addEventListener('click', cancelDeal);
    }
    if(!flag){
        dealRequestsWrapper.innerHTML = '<p class="p-paragraph">Тут ничего нет 😢</p>';
    }
}


function showDeals(allDeals){
    const dealsWrapper = document.getElementById('deals__wrapper');
    let flag = false;
        if(allDeals){
            const obj = {'complete':'gradient__text', 'cancel':'deal__status__canceled', "decline": 'deal__status__canceled', 'process':'deal__status__process'};
            const obj2 = {'complete':'Завершилась', 'cancel':'Отменено', 'decline':'Отменено', 'process':'В процессе'};
            for(let dealInfo of Object.values(allDeals)){
                if(dealInfo){
                    const time = new Date(dealInfo?.date * 1000);
                    let [dd, mm, yy] = [time.getDate(), time.getMonth(), time.getFullYear()];
                    if(dd < 10){dd = '0' + dd;}
                    if(mm < 10){mm = '0' + mm;}
                    flag = true;
                    const a = document.createElement('a');
                    const [customer, seller] = [dealInfo?.user_customer, dealInfo?.user_seller];
                    a.href = `../deal?id=${dealInfo?.id}`;
                    a.classList = ['deal__item__wrapper-link'];
                    a.innerHTML += `
            <div class="deal__item">
                <h3 class="l-header">${dealInfo?.title}</h3>
                <div class="deal__item__info1">
                    <span class="p-paragraph deal__usernamefrom">Сделка с <a href="${siteLink}/user/?username=${seller != login ? seller : customer}">${seller != login ? seller : customer}</a></span>
                    <span class="p-paragraph">${mm}.${dd}.${yy}</span>
                </div>
                <div class="deal__item__info2">
                    <span class="deal__price">${dealInfo?.price}₽</span>
                    <span class="deal__status p-paragraph">Статус: <span class="deal__status__info ${obj[dealInfo?.status] ?? 'deal__status__process'}">${obj2[dealInfo?.status] ?? 'В процессе'}</span></span>
                </div>
            </div>`;
                    dealsWrapper.appendChild(a);
                }
            }
        }
        if(!flag){
            dealsWrapper.innerHTML = '<p class="p-paragraph">Тут ничего нет 😢</p>';
        }
}

function showReviews(allReviews){
    const reviewsWrapper = document.getElementById('reviews__wrapper');
    let flag = false;
        if(allReviews){
            for(let reviewInfo of Object.values(allReviews)){
                const time = new Date(reviewInfo?.date * 1000);
                let [dd, mm, yy] = [time.getDate(), time.getMonth(), time.getFullYear()];
                if(dd < 10){dd = '0' + dd;}
                if(mm < 10){mm = '0' + mm;}
                flag = true;
                reviewsWrapper.innerHTML += `
            <div class="review__item">
                <h3 class="l-header">${reviewInfo?.title}</h3>
                <div class="deal__item__info1">
                    <span class="p-paragraph deal__usernamefrom">Отзыв от <a href="${siteLink}/user/?username=${reviewInfo?.sender}">${reviewInfo?.sender}</a></span>
                    <span class="p-paragraph">${mm}.${dd}.${yy}</span>
                </div>
                <p class="p-paragraph">${reviewInfo?.content ?? ' '}</p>
                <span class="p-paragraph">Оценка: ${reviewInfo?.grade}⭐</span>
                <span class="deal__price">${reviewInfo?.price}₽</span>
            </div>`;
            }
        }
        if(!flag){
            reviewsWrapper.innerHTML = '<p class="p-paragraph">Тут ничего нет 😢</p>';
        }
}

function acceptDeal(e){
    const data = new URLSearchParams();
    data.append('dealId', this.getAttribute('deal-id'));
    data.append('uApi', isLogined);
    fetch(siteLink + "/backend/accept-deal", {method: 'POST', mode:'cors', body: data}).then(gotData => gotData.json())
    .then(response => {
        if(response?.status){
            location.reload();
        }
    }).catch(error => {
        console.log(error);
    });
}

function cancelDeal(e){
    const data = new URLSearchParams();
    data.append('dealId', this.getAttribute('deal-id'));
    data.append('uApi', isLogined);
    fetch(siteLink + "/backend/decline-deal", {method: 'POST', mode:'cors', body: data}).then(gotData => gotData.json())
    .then(response => {
        if(response?.status){
            location.reload();
        }
    }).catch(error => {
        console.log(error);
    });
}

function removePreloads(){
    for(let preload of document.querySelectorAll('.preload')){
        preload.classList.remove('preload');
    }
    for(let preloadText of document.querySelectorAll('.preload-text')){
        preloadText.classList.remove('preload-text');
    }
}

function exit(){
    localStorage.removeItem('apiKey');
    localStorage.removeItem('login');
    window.location.href = siteLink;
}

if(isLogined){
    showProfile();
    document.getElementById('exit').addEventListener('click', exit);
    document.getElementById('exit2').addEventListener('click', exit);
}
