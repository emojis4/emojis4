import {siteLink} from './config.js';

let photoLink = siteLink + '/assets/images/default-user2.png';
let photo;
const isLogined = localStorage.getItem('apiKey');

function getPhotoLinkImgur(ev){
    const formdata = new FormData();
    formdata.append("image", ev.target.files[0]);
    fetch("https://api.imgur.com/3/image/", {
        method: "post",
        headers: {
            Authorization: "Client-ID 029e3e62a6377a6"
            // client secret 2a913961cf4866d44dd3393f902a4dfb8eefc875
        },
        body: formdata
    }).then(data => data.json()).then(data => {
        const imageLink = data.data.link;
        if(imageLink){
            document.getElementById('settings-avatar').src = imageLink;
            photoLink = imageLink;
            return imageLink;
        }
    })
}

function getPhotoLink(ev){
    photoLink = URL.createObjectURL(ev.target.files[0]);
    document.getElementById('settings-avatar').src = photoLink;
    let reader = new FileReader();
    reader.readAsDataURL(ev.target.files[0]);
    reader.onload = function(e) {
        photo = reader.result;
    };
}

function sendPhoto(){
    if(photo){
        const data = new URLSearchParams();
        data.append('uApi', isLogined);
        data.append('image', photo.match(/(?<=base64,).+/)[0]);
        fetch(siteLink + "/backend/set-photo", {method: 'POST', mode:'cors', body: data}).then(gotData => gotData.json())
            .then(response => {
            if(!response?.status){
                document.getElementById('request__error1').textContent = response.message.ru;
            }
            else{
                document.getElementById('request__success1').textContent = response.message.ru;
            }
            }).catch(error => {
            console.log(error);
        });
    }
}

function updateEmail(){
    const data = new URLSearchParams();
    data.append('uApi', isLogined);
    data.append('old_mail', document.getElementById('old_mail').value);
    data.append('new_mail', document.getElementById('new_mail').value);
    data.append('password', document.getElementById('password').value);
    document.getElementById('old_mail').value = '';
    document.getElementById('new_mail').value = '';
    document.getElementById('password').value = '';
    fetch(siteLink + "/backend/settings-change-mail", {method: 'POST', mode:'cors', body: data}).then(gotData => gotData.json())
        .then(response => {
            if(!response?.status){
                document.getElementById('request__error2').textContent = response.message.ru;
            }
            else{
                document.getElementById('request__success2').textContent = response.message.ru;
            }
        }).catch(error => {
        console.log(error);
    });
}

function resetPassword(){
    const data = new URLSearchParams();
    data.append('mail', document.getElementById('mail').value);
    document.getElementById('mail').value = '';
    fetch(siteLink + "/backend/settings-change-password", {method: 'POST', mode:'cors', body: data}).then(gotData => gotData.json())
        .then(response => {
            if(!response?.status){
                document.getElementById('request__error3').textContent = response.message.ru;
            }
            else{
                document.getElementById('request__success3').textContent = response.message.ru;
            }
        }).catch(error => {
        console.log(error);
    });
}

if(isLogined){
    document.getElementById("file").addEventListener("change", getPhotoLink);
    document.getElementById("save-avatar").addEventListener("click", sendPhoto);
    document.getElementById("update-mail").addEventListener("click", updateEmail);
}

document.getElementById("change-password").addEventListener("click", resetPassword);