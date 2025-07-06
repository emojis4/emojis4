import {siteLink} from './config.js';
const isLogined = localStorage.getItem('apiKey');
const login = localStorage.getItem('login');

function showReviews2(e){
    fetch(siteLink + "/backend/last-reviews?key=" + isLogined, {method: 'GET', mode:'cors'}).then(gotData => gotData.json())
    .then(response => {
        const reviewsWrapper = document.getElementById('reviews__wrapper');
        if(response?.status){
            for(let reviewInfo of Object.values(response.reviews)){
                const time = new Date(reviewInfo?.date * 1000);
                let [dd, mm, yy] = [time.getDate(), time.getMonth(), time.getFullYear()];
                if(dd < 10){dd = '0' + dd;}
                if(mm < 10){mm = '0' + mm;}
                reviewsWrapper.innerHTML += `
            <div class="review__item">
                <h3 class="l-header">${reviewInfo?.title}</h3>
                <div class="deal__item__info1">
                    <span class="p-paragraph deal__usernamefrom">Отзыв от <a href="${login == reviewInfo?.sender ? siteLink + '/profile' : siteLink + '/user/?username=' + reviewInfo?.sender}">${reviewInfo?.sender}</a></span>
                    <span class="p-paragraph">${mm}.${dd}.${yy}</span>
                </div>
                <p class="p-paragraph">${reviewInfo?.content ?? ' '}</p>
                <span class="p-paragraph">Оценка: ${reviewInfo?.grade}⭐</span>
                <span class="deal__price">${reviewInfo?.price}₽</span>
            </div>`;
            }
        }
        else{
            reviewsWrapper.innerHTML = '<p class="p-paragraph">Ошибка :(</p>';
        }
    }).catch(error => {
        console.log(error);
        reviewsWrapper.innerHTML = '<p class="p-paragraph">Ошибка :(</p>';
    });
}

if(isLogined){showReviews2();}
else{
    reviewsWrapper.innerHTML = '<p class="p-paragraph">Тут ничего нет 😢</p>';
}