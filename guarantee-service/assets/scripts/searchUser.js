import {siteLink} from './config.js';
const isLogined = localStorage.getItem('apiKey');
const login = localStorage.getItem('login');
const usernameForSearch = new URLSearchParams(window.location.search).get('username');

function showProfile(){
    const time = new Date();
    let [dd, mm, yy] = [time.getDate(), time.getMonth(), time.getFullYear()];
    if(dd < 10){dd = '0' + dd;}
    if(mm < 10){mm = '0' + mm;}
    document.getElementById('todayDate').textContent = `${dd}.${mm}.${yy}`;
    document.getElementById('todayDate2').textContent = `${dd}.${mm}.${yy}`;
    const startDeal1 = document.getElementById('startDeal1');
    const avatar = document.getElementById('avatar');
    const avatar2 = document.getElementById('avatar2');
    const startDeal2 = document.getElementById('startDeal2');
    fetch(siteLink + "/backend/profile?key=" + isLogined + '&username=' + usernameForSearch, {method: 'GET', mode:'cors'}).then(gotData => gotData.json())
.then(response => {
    const avatarLink = response?.user?.avatar;
    document.getElementById('level').textContent = response?.user?.level + ' Уровень';
    document.getElementById('login').textContent = response?.user?.login;
    document.getElementById('dealsCount').textContent = response?.deal?.dealsCount;
    document.getElementById('successDeals').textContent = response?.deal?.successDeals;
    document.getElementById('cancelDeals').textContent = response?.deal?.cancelDeals;
    document.getElementById('reviewAverage').textContent = response?.review?.reviewAverage ?? 0;
    if(avatarLink){
        avatar.src = avatarLink;
        avatar2.src = avatarLink;
    }
    document.getElementById('level2').textContent = response?.user?.level + ' Уровень';
    document.getElementById('login2').textContent = response?.user?.login;
    document.getElementById('dealsCount2').textContent = response?.deal?.dealsCount;
    document.getElementById('successDeals2').textContent = response?.deal?.successDeals;
    document.getElementById('cancelDeals2').textContent = response?.deal?.cancelDeals;
    document.getElementById('reviewAverage2').textContent = response?.review?.reviewAverage ?? 0;
    startDeal1.href = '../createdeal?username=' + response?.user?.login;
    startDeal2.href = '../createdeal?username=' + response?.user?.login;
    document.getElementById('deals-link').href = siteLink + '/info?q=deals&username=' + usernameForSearch;
    document.getElementById('reviews-link').href = siteLink + '/info?q=reviews&username=' + usernameForSearch;
    for(let starNumber = 1; starNumber <= +response?.review?.reviewAverage; starNumber++){
        const currentStar = document.querySelector(`.star${starNumber}`);
        currentStar.classList.remove('starGray');
        currentStar.classList.add('starYellow');
    }
    showDeals(response.deal.allDeals);
    showReviews(response.review.allReviews);
    removePreloads();
}).catch(error => {
    console.log(error);
});
}

function showDeals(allDeals){
    const dealsWrapper = document.getElementById('deals__wrapper');
    let flag = false;
        if(allDeals){
            const obj = {'complete':'gradient__text', 'cancel':'deal__status__canceled', 'process':'deal__status__process'};
            const obj2 = {'complete':'Завершилась', 'cancel':'Отменено', 'process':'В процессе'};
            for(let dealInfo of Object.values(allDeals)){
                if(dealInfo){
                    const time = new Date(dealInfo?.date * 1000);
                    let [dd, mm, yy] = [time.getDate(), time.getMonth(), time.getFullYear()];
                    if(dd < 10){dd = '0' + dd;}
                    if(mm < 10){mm = '0' + mm;}
                    flag = true;
                    const [customer, seller] = [dealInfo?.user_seller, dealInfo?.user_customer];
                    dealsWrapper.innerHTML += `
            <div class="deal__item">
                <h3 class="l-header">${dealInfo?.title}</h3>
                <div class="deal__item__info1">
                    <span class="p-paragraph deal__usernamefrom">Сделка с <a href="${usernameForSearch != login && (seller == login || customer == login) ? "/profile" : (seller != usernameForSearch ? siteLink + "/user/?username=" + seller : siteLink + "/user/?username=" + customer)}">${seller != usernameForSearch ? seller : customer}</a></span>
                    <span class="p-paragraph">${mm}.${dd}.${yy}</span>
                </div>
                <div class="deal__item__info2">
                    <span class="deal__price">${dealInfo?.price}₽</span>
                    <span class="deal__status p-paragraph">Статус: <span class="deal__status__info ${obj[dealInfo?.status] ?? 'deal__status__process'}">${obj2[dealInfo?.status] ?? 'В процессе'}</span></span>
                </div>
            </div>`;
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
                    <span class="p-paragraph deal__usernamefrom">Отзыв от <a href="${usernameForSearch != login ? "/profile" : siteLink + '/user/?username=' + reviewInfo?.sender}">${reviewInfo?.sender}</a></span>
                    <span class="p-paragraph">${mm}.${dd}.${yy}</span>
                </div>
                <p class="p-paragraph">${reviewInfo?.content ?? ' '}</p>
                <span class="p-paragraph">Оценка: ${reviewInfo?.grade}⭐</span>
                <span class="deal__price">${reviewInfo?.price}₽</span>
            </div>`
            }
        }
        if(!flag){
            reviewsWrapper.innerHTML = '<p class="p-paragraph">Тут ничего нет 😢</p>';
        }
}

function removePreloads(){
    for(let preload of document.querySelectorAll('.preload')){
        preload.classList.remove('preload');
    }
    for(let preloadText of document.querySelectorAll('.preload-text')){
        preloadText.classList.remove('preload-text');
    }
}

if(isLogined){
    showProfile();
}
