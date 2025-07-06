const isLogined = localStorage.getItem('apiKey');

if(!isLogined){
    for(let itemTohide of document.querySelectorAll('.logined__wrapper')){
        itemTohide.classList.add('display__none');
    }
}

else{
    for(let itemTohide of document.querySelectorAll('.unlogined__wrapper')){
        itemTohide.classList.add('display__none');
    }
}