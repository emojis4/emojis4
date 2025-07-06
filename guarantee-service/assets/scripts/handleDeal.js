import {siteLink} from './config.js';
const isLogined = localStorage.getItem('apiKey');
const login = localStorage.getItem('login');

const messagesWrapper = document.getElementById('messages__wrapper');
let messagesCount = 0;
const scrollableChat = document.querySelector('.chat__itself');
const dealId = new URLSearchParams(window.location.search).get('id');
let chosenStatus = null;
let isReviewSent = null;


function getAllMessages(){
    infoDeal();
    const data = new URLSearchParams();
    data.append('uApi', isLogined);
    data.append('dealId', dealId);
    fetch(siteLink + "/backend/chat-history", {method: 'POST', mode:'cors', body: data}).then(gotData => gotData.json())
    .then(response => {
        messagesCount = Object.keys(response.messages).length;
        for(let message of Object.entries(response.messages)){
            if(message[1].sender == login){
                messagesWrapper.innerHTML += `<div class="my-message__wrapper">${message[1].message}</div>`;
            }
            else{
                messagesWrapper.innerHTML += `<div class="recipient-message__wrapper p-paragraph userImageLeft">${message[1].message}</div>`;
            }
        }
        removePreloads();
    }).catch(error => {
        console.log(error);
    });
}

function sendMessage(){
    if(document.getElementById('chatInput').value.length > 0){
        messagesWrapper.innerHTML += `<div class="my-message__wrapper">${document.getElementById('chatInput').value}</div>`;
        messagesCount += 1;
        scrollToBottom();
        const data = new URLSearchParams();
        data.append('uApi', isLogined);
        data.append('dealId', dealId);
        data.append('message', document.getElementById('chatInput').value);
        fetch(siteLink + "/backend/chat-message", {method: 'POST', mode:'cors', body: data});
        document.getElementById('chatInput').value = '';
    }
}

function checkNewMessages(){
    const data = new URLSearchParams();
    data.append('uApi', isLogined);
    data.append('dealId', dealId);
    data.append('messages-count', messagesCount);
    fetch(siteLink + "/backend/chat-listen", {method: 'POST', mode:'cors', body: data}).then(gotData => gotData.json()).then(response => {
        if(JSON.parse(response.status)){
            for(let message of Object.entries(response.messages)){
                messagesCount += 1;
                if(message[1].sender == login){
                    messagesWrapper.innerHTML += `<div class="my-message__wrapper">${message[1].message}</div>`;
                }
                else{
                    messagesWrapper.innerHTML += `<div class="recipient-message__wrapper p-paragraph userImageLeft">${message[1].message}</div>`;
                }
            }
            scrollToBottom();
        }
    });
}

function infoDeal(){
    const data = new URLSearchParams();
    data.append('uApi', isLogined);
    data.append('dealId', dealId);
    fetch(siteLink + "/backend/info-deal", {method: 'POST', mode:'cors', body: data}).then(gotData => gotData.json()).then(response => {
        const [customer, seller] = [response.deal.user_customer, response.deal.user_seller];
        const obj = {'complete':'gradient__text', 'cancel':'deal__status__canceled', "decline": 'deal__status__canceled', 'process':'deal__status__process'};
        const obj2 = {'complete':'Завершилась', 'cancel':'Отменено', 'decline':'Отменено', 'process':'В процессе'};
        const obj3 = {'accept': 'Завершить сделку', 'decline': 'Отменить сделку', 'report': 'Пожаловаться'};
        document.getElementById('deal-name').textContent = response.deal.title;
        document.getElementById('deal-customer').innerHTML = `Покупатель: <a href="${customer == login ? "/profile" : `${siteLink}/user/?username=` + customer}">${customer}</a>`;
        document.getElementById('deal-seller').innerHTML = `Продавец: <a href="${seller == login ? "/profile" : `${siteLink}/user/?username=` + seller}">${seller}</a>`;
        document.getElementById('deal-price').textContent = response.deal.price + '₽';
        document.getElementById('deal-status').innerHTML = `Статус: <span class="deal__status__info ${obj[response.deal.status] ?? 'deal__status__process'}">${obj2[response.deal.status] ?? 'В процессе'}</span>`;
        document.getElementById('chat-recipient').textContent = '@' + (seller != login ? seller : customer);
        document.getElementById('chat-recipient').setAttribute('href', siteLink + '/user?username=' + (seller != login ? seller : customer));
        document.getElementById('status-deal-seller').textContent = seller;
        document.getElementById('status-deal-seller').href = customer != login ? "/profile" : `${siteLink}/user/?username=` + customer;
        document.getElementById('status-deal-customer').textContent = customer;
        document.getElementById('status-deal-customer').href = customer == login ? "/profile" : `${siteLink}/user/?username=` + customer;
        document.getElementById('seller-deal-status').textContent = obj3[response?.deal?.seller_status] ?? 'Не выбран';
        document.getElementById('customer-deal-status').textContent = obj3[response?.deal?.customer_status] ?? 'Не выбран';
        if(customer == login){
            isReviewSent = response?.deal?.customer_review;
        }
        else{
            isReviewSent = response?.deal?.seller_review;
        }
        const status = response?.deal?.status;
        if(status == 'accept' || status == 'decline' && !isReviewSent){
            toggleReview();
        }
    });
}

function scrollToBottom(){
    scrollableChat.scrollTop = scrollableChat.scrollHeight;
}

function removePreloads(){
    for(let preload of document.querySelectorAll('.preload')){
        preload.classList.remove('preload');
    }
    for(let preloadText of document.querySelectorAll('.preload-text')){
        preloadText.classList.remove('preload-text');
    }
    document.getElementById('chat-recipient').classList.add('userImageLeft');
}

function setDealStatus(){
    const data = new URLSearchParams();
    data.append('uApi', isLogined);
    data.append('dealId', dealId);
    data.append('status', chosenStatus);
    if(chosenStatus){
        fetch(siteLink + "/backend/set-deal-status", {method: 'POST', mode:'cors', body: data}).then(gotData => gotData.json())
            .then(response => {
                toggleStatusModal();
                location.reload();
            }).catch(error => {
            console.log(error);
        });
    }
}

function toggleStatusModal(status){
    const statusModal = document.getElementById('status-modal');
    chosenStatus = status;
    statusModal.classList.toggle('display__none');
}

function toggleReview(){
    const reviewWrapper = document.getElementById('sendReviewAboutDeal');
    reviewWrapper.classList.toggle('display__none');
}

function setStars(){
    const starValue = +document.querySelector('.inputStar:checked').value;
    document.getElementById('reviewAmount').textContent = `${starValue},0`;
    let starCounter = 0;
    for(let star of document.querySelectorAll('.star')){
        starCounter += 1;
        star.classList.remove('starGray');
        star.classList.remove('starYellow');
        if(starCounter <= starValue){
            star.classList.add('starYellow');
        }
        else{
            star.classList.add('starGray');
        }
    }
}

function sendReview(){
    const data = new URLSearchParams();
    data.append('uApi', isLogined);
    data.append('dealId', dealId);
    data.append('grade', document.querySelector('.inputStar:checked').value);
    if(document.getElementById('reviewContent').value){
        data.append('content', document.getElementById('reviewContent').value);
    }
    fetch(siteLink + "/backend/set-deal-review", {method: 'POST', mode:'cors', body: data}).then(gotData => gotData.json())
        .then(response => {
            if(response?.status){
                toggleReview();
            }
        }).catch(error => {
        console.log(error);
    });
}


if(isLogined){
    getAllMessages();
    scrollToBottom();
    setInterval(checkNewMessages, 3000);
    document.getElementById('sendMessageButton').addEventListener('click', sendMessage);
    document.getElementById('chatInput').addEventListener('keypress', function(event){
        if (event.key === "Enter") {sendMessage();}
    });
    document.getElementById('endDeal').addEventListener('click', function(){toggleStatusModal('accept');});
    document.getElementById('cancelDeal').addEventListener('click', function(){toggleStatusModal('decline');});
    document.getElementById('reportDeal').addEventListener('click', function(){toggleStatusModal('report');});
    document.getElementById('statusYes').addEventListener('click', setDealStatus);
    document.getElementById('statusNo').addEventListener('click', function(){toggleStatusModal(null);});
    document.getElementById('dealRevirewNo').addEventListener('click', toggleReview);
    document.getElementById('dealRevirewYes').addEventListener('click', sendReview);
    for(let inputStar of document.querySelectorAll('.inputStar')){
        inputStar.addEventListener('click', setStars);
    }
}