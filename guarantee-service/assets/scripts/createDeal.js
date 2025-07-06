import {siteLink} from './config.js';

const isLogined = localStorage.getItem('apiKey');
const usernameForDeal = new URLSearchParams(window.location.search).get('username');
const form = document.getElementById('form');
const requestStatusWrapper = document.getElementById('request-status');

if(usernameForDeal){
    document.getElementById('recipient').value = usernameForDeal;
    window.history.replaceState({}, '', siteLink + '/createdeal/');
}

if(isLogined){
    document.getElementById('uApi').value = isLogined;
    form.addEventListener('submit', createDeal);
}

function createDeal(e){
    e.preventDefault();
    const data = new URLSearchParams();
    for (const pair of new FormData(this)) {
        data.append(pair[0], pair[1]);
    }
    fetch(siteLink + "/backend/create-deal", {method: 'POST', mode:'cors', body: data}).then(gotData => gotData.json())
    .then(response => {
        if(response?.status){
            requestStatusWrapper.innerHTML = '<span class="request__success">Сделка создана</span>';
            setTimeout(() => {window.location.href = `${siteLink}/profile`;}, 1500);
        }
        else{
            requestStatusWrapper.innerHTML = `<img src="../assets/images/error.png" alt="ошибка" class="error__image"><span class="request__error">${response?.message?.ru ?? "Ошибка"}</span>`;
        }
    }).catch(error => {
        requestStatusWrapper.innerHTML = `<img src="../assets/images/error.png" alt="ошибка" class="error__image"><span class="request__error">${response?.message?.ru ?? "Ошибка"}</span>`;
    });
}

