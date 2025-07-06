import {siteLink} from './config.js';

const searchInput = document.getElementById('searchInput');
const inputSubmit = document.getElementById('inputSubmit');
const searchResults = document.getElementById('searchresults__wrapper');
const notFoundWrapper = document.getElementById('search-notFound-wrapper');


function search(e){
    if(searchInput.value.length > 4){
        searchResults.innerHTML = '';
        fetch(`${siteLink}/backend/search?key=${localStorage.getItem('apiKey')}&username=${searchInput.value}`, {method: 'GET', mode:'cors'}).then(gotData => gotData.json())
        .then(response => {
            if(Array.isArray(response)){
                searchResults.classList.add('display__none');
                notFoundWrapper.classList.remove('display__none');
            }
            else{
                searchResults.classList.remove('display__none');
                notFoundWrapper.classList.add('display__none');
                const foundedUsers = Object.entries(response).sort((a, b) => a[1] > b[1]);
                for(let user of foundedUsers){
                    console.log(user)
                    searchResults.innerHTML += `
                <a class="searchresult__item" href='../user/?username=${user[0]}'>
                    <img src="../assets/images/default-user1.png" alt="Аватар" class="searchresult__image">
                    <span class="l-header">${user[0]}</span>
                </a>
                `
                }
            }
        }).catch(error => {
            console.log(error);
        });
    }
    else{
        notFoundWrapper.classList.remove('display__none');
        searchResults.classList.add('display__none');
    }
}

inputSubmit.addEventListener('click', search);
searchInput.addEventListener('keypress', function(event){
    if (event.key === "Enter") {search();}
});