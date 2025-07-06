import {siteLink} from './config.js';


function resetPassword(){
    const t = new URLSearchParams(window.location.href.split('?')[1]);
    const data = new URLSearchParams();
    data.append('token', t.get('t'));
    data.append('password', document.getElementById('password').value);
    document.getElementById('password').value = '';
    fetch(siteLink + "/backend/settings-change-password", {method: 'POST', mode:'cors', body: data}).then(gotData => gotData.json())
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

document.getElementById("reset-password").addEventListener("click", resetPassword);
