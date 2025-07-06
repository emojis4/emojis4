import {siteLink} from './config.js';
const isLogined = localStorage.getItem('apiKey');
const login = localStorage.getItem('login');
let username;
let currentCategory;
let currentPage = 1;



function removePreloads(){
    for(let preload of document.querySelectorAll('.preload')){
        preload.classList.remove('preload');
    }
    for(let preloadText of document.querySelectorAll('.preload-text')){
        preloadText.classList.remove('preload-text');
    }
}

function showContent(){
    const params = new URLSearchParams(window.location.href.split('?')[1]);
    currentCategory = params.get('q');
    username = params.get('username');
    currentPage = params.get('page') || 1;
    hideOtherCategories(currentCategory);
    removePreloads();
    if(currentCategory == 'deals'){
        showDeals(currentPage);
    }
    else if(currentCategory == 'reviews'){
        showReviews(currentPage);
    }
    generatePagination();
}

function showDeals(page=1){
    const data = new URLSearchParams();
    data.append('uApi', isLogined);
    data.append('username', username);
    data.append('action', 'deals');
    data.append('page', page);
    fetch(siteLink + "/backend/profile-info", {method: 'POST', mode:'cors', body: data}).then(gotData => gotData.json())
    .then(response => {
        let flag = false;
        if(response?.status !== false){
            const dealsWrapper = document.getElementById('deals__wrapper');
                if(response){
                    const obj = {'complete':'gradient__text', 'cancel':'deal__status__canceled', "decline": 'deal__status__canceled', 'process':'deal__status__process'};
                    const obj2 = {'complete':'Завершилась', 'cancel':'Отменено', 'decline':'Отменено', 'process':'В процессе'};
                    for(let dealInfo of Object.values(response)){
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
            }
        if(!flag){
            document.getElementById('pagination-forward').classList.add('grayscale');
            document.getElementById('deals__wrapper').innerHTML = '<p class="p-paragraph">Тут ничего нет 😢</p>';
        }
    }).catch(error => {
        console.log(error);
    });
}

function showReviews(page=1){
    const data = new URLSearchParams();
    data.append('uApi', isLogined);
    data.append('username', username);
    data.append('action', 'reviews');
    data.append('page', page);
    fetch(siteLink + "/backend/profile-info", {method: 'POST', mode:'cors', body: data}).then(gotData => gotData.json())
    .then(response => {
        const reviewsWrapper = document.getElementById('reviews__wrapper');
        let flag = false;
            if(response.status !== false){
                for(let reviewInfo of Object.values(response)){
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
                document.getElementById('pagination-forward').classList.add('grayscale');
                document.getElementById('reviews__wrapper').innerHTML = '<p class="p-paragraph">Тут ничего нет 😢</p>';
            }
    }).catch(error => {
        console.log(error);
    });
}

function hideOtherCategories(category){
    switch(category){
        case 'deals':   
            document.getElementById('reviews').classList.add('display__none');
            break;
        case 'reviews':   
            document.getElementById('deals').classList.add('display__none');
            break;
    }
}

function generatePagination(){
    document.getElementById('page-number').textContent = currentPage;
    if(currentPage == 1){
        document.getElementById('pagination-back').href = '.';
        document.getElementById('pagination-back').classList.add('grayscale');
        document.getElementById('pagination-forward').href = `${siteLink}/info/?q=${currentCategory}&username=${username}&page=${+currentPage + 1}`;
    }
    else{
        document.getElementById('pagination-forward').href = `${siteLink}/info/?q=${currentCategory}&username=${username}&page=${+currentPage + 1}`;
        document.getElementById('pagination-back').href = `${siteLink}/info/?q=${currentCategory}&username=${username}&page=${+currentPage - 1}`;
    }
}

showContent();