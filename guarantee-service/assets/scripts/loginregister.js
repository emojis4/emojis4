import {siteLink} from './config.js';

const loginRegisterForm = document.getElementById('loginregisterform');
const requestStatusWrapper = document.getElementById('request-status');
const isRegister = document.getElementById('email') !== null;

const isLogined = localStorage.getItem('apiKey');
if(isLogined){
    window.location.href = `${siteLink}/profile`;
}

function loginOrRegister(e){
    e.preventDefault();
    const data = new URLSearchParams();
    for (const pair of new FormData(this)) {
        data.append(pair[0], pair[1]);
    }
    fetch(siteLink + (isRegister ? "/backend/register" : "/backend/auth"), {method: 'POST', mode:'cors', body: data}).then(gotData => gotData.json())
    .then(response => {
        if(response?.status != false){
            if(isRegister){
                requestStatusWrapper.innerHTML = '<span class="request__success">Регистрация завершена</span>';
                setTimeout(() => {window.location.href = `${siteLink}/login`;}, 1500);
            }
            else{
                requestStatusWrapper.innerHTML = '<span class="request__success">Вы авторизованы</span>';
                if(response['apiKey']){
                    localStorage.setItem('apiKey', response['apiKey']);
                    localStorage.setItem('login', response['login']);
                    setTimeout(() => {window.location.href = `${siteLink}/profile`;}, 1500);
                }
                else{
                    throw 'Something went wrong!';
                }
            }
        }
        else{
            requestStatusWrapper.innerHTML = `<img src="../assets/images/error.png" alt="ошибка" class="error__image"><span class="request__error">${response?.message?.ru ?? "Ошибка"}</span>`;
        }
    }).catch(error => {
        requestStatusWrapper.innerHTML = `<img src="../assets/images/error.png" alt="ошибка" class="error__image"><span class="request__error">${response?.message?.ru ?? "Ошибка"}</span>`;
    });
}

loginRegisterForm.addEventListener('submit', loginOrRegister);