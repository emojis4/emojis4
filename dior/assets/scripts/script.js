// burger
const burger = document.querySelector('.burger');
const burgerMenu = document.querySelector('.header__nav');

function openBurgerMenu(e=null){
    if(this == burger || burger.classList.contains('burger__opened')){
        burger.classList.toggle('burger__opened');
        burgerMenu.classList.toggle('burger__menu__closed');
    }
}

burger.addEventListener('click', openBurgerMenu);


// up button

const upButton = document.querySelector('.footer__button');
upButton.addEventListener('click', ()=>{window.scrollTo(0, 0);});

// sliders

const slider1 = document.querySelector('#slider1');
const slider2 = document.querySelector('#slider2');
const slider3 = document.querySelector('.sec4__catalog');
const sliders = [slider1, slider2, slider3];

function swipe(sliderNumber, where){
    const slider = sliders[sliderNumber-1];
    slider.scrollBy(slider.scrollWidth / slider.childElementCount / (window.innerWidth >= 900 ? 2 : 1) * where, 0);
}