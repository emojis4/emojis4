const burger = document.querySelector('.burger');
const burgerMenu = document.querySelector('.burger__menu');

burger.addEventListener('click', function(e){
    burger.classList.toggle('burger__opened');
    burgerMenu.classList.toggle('display__none');
});

// console.log("%c" + "Создатели: https://github.com/LovkachDev и https://github.com/J8Q", "color: #0afc3f; -webkit-text-stroke: 2px black; font-size: 18px; font-weight: bold;");
// console.log("%c" + "СТОЙ!", "color: red; -webkit-text-stroke: 2px black; font-size: 72px; font-weight: bold;");
// console.log("%c" + "Копирование чего-либо в консоль влечёт к непредвиденным последствиям.", "color: #7289DA; -webkit-text-stroke: 2px black; font-size: 20px; font-weight: bold;");
// console.log("%c" + "Если вы не хотите, чтобы злоумышленники получили доступ к вашему аккаунту - закройте консоль.", "color: #7289DA; -webkit-text-stroke: 2px black; font-size: 20px; font-weight: bold;");