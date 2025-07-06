 // up button
const upButton = document.querySelector('.footer__up__btn');
upButton.addEventListener('click', function(e){window.scrollTo(0, 0);});


// shop items

const slider = document.querySelector('.products');
const slideButton = document.querySelector('.section4__arrow');

slideButton.addEventListener('click', function(e){
    if(slider.scrollLeft / (slider.scrollWidth - slider.offsetWidth) * 100 <= -98){slider.scrollTo(0, 0);}
    else{slider.scrollBy(-slider.scrollWidth / slider.childElementCount, 0);}
});

// burger menu

const burger = document.querySelector('.burger');
const burgerMenu = document.querySelector('.header__nav');

function showBurgerMenu(e){
    if(this == burger || burger.classList.contains('burger__opened')){
        burger.classList.toggle('burger__opened');
        burgerMenu.classList.toggle('burger__menu__none');
    }
}

burger.addEventListener('click', showBurgerMenu);


// show events

const arrow = document.querySelector('.sec5__arrow');
const events = document.querySelector('.section5__lower');
arrow.addEventListener('click', function(e){
    events.classList.add('section5__lower__scroll');
    arrow.style.display = 'none';
});