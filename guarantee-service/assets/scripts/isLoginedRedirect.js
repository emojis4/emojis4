import {siteLink} from './config.js';

const isLogined = localStorage.getItem('apiKey');

if(!isLogined){
    window.location.href = `${siteLink}/login`;
}