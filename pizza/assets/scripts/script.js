// strange button

const strangeButton = document.querySelector('.strange__button__wrapper');
const strangeButtonEllipse = document.querySelector('.strange__button__ellipse');
const firstElem = document.querySelector('.strange__button__text__selected');
const secondElem = document.querySelector('.strange__button__text');

strangeButton.addEventListener('click', function(e){
    firstElem.classList.toggle('strange__button__text');
    firstElem.classList.toggle('strange__button__text__selected');
    secondElem.classList.toggle('strange__button__text');
    secondElem.classList.toggle('strange__button__text__selected');
    strangeButtonEllipse.classList.toggle('strange__button__ellipse__left');
    strangeButtonEllipse.classList.toggle('strange__button__ellipse__right');
});

// price amount
function changeAmount(e){
    const target = e.target;
    const isMinus = target.classList.contains('minus__btn');
    const isPlus = target.classList.contains('plus__btn');
    const priceNowWrapper = this.querySelector('.price__now');
    if(isMinus || isPlus){
        const valueWrapper = this.querySelector('.pizza__item__amount');
        let value = valueWrapper.textContent;
        const originalPrice = this.querySelector('.original__price').textContent;
        if(isMinus && +value > 1){
            const calculatedValue = (--value * originalPrice).toFixed(2);
            priceNowWrapper.textContent = calculatedValue;
            valueWrapper.textContent = value;
            if(value == 1){
                const minusBtn = this.querySelector('.minus__btn');
                minusBtn.classList.remove('button__plus__minus__active');
                minusBtn.classList.add('button__plus__minus');
            }
            if(value == 9){
                const plusBtn = this.querySelector('.plus__btn');
                plusBtn.classList.remove('button__plus__minus');
                plusBtn.classList.add('button__plus__minus__active');
            }
        }
        if(isPlus && +value < 10){
            const calculatedValue = (++value * originalPrice).toFixed(2);
            priceNowWrapper.textContent = calculatedValue;
            valueWrapper.textContent = value;
            if(value == 2){
                const minusBtn = this.querySelector('.minus__btn');
                minusBtn.classList.remove('button__plus__minus');
                minusBtn.classList.add('button__plus__minus__active');
            }
            if(value == 10){
                const plusBtn = this.querySelector('.plus__btn');
                plusBtn.classList.remove('button__plus__minus__active');
                plusBtn.classList.add('button__plus__minus');
            }
        }
    }
    const priceWrapper = this.querySelector('.pizza__item__price');
    const checkedSizeValue = this.querySelector('.input__pizzaItem_sizes:checked').value;
    const isCheckedAdditional = this.querySelector('.input__pizzaAdditionalIngredients').checked ? 1.3 : 1;
    priceWrapper.innerHTML = `${(priceNowWrapper.textContent * checkedSizeValue * isCheckedAdditional).toFixed(2)}<sup class="price__sup">$</sup>`;
}

for(let pizzaItem of document.querySelectorAll('.pizza__item')){
    pizzaItem.addEventListener('click', changeAmount);
}

// pizzas sorting
const allPizzas = {};
const sortings = {
    'all': ['Italian', 'Venecia', 'Meat', 'Cheese', 'Argentina', 'Gribnaya', 'Tomato', 'Italian_x2'],
    'meat': ['Italian', 'Venecia', 'Meat', 'Tomato', 'Italian_x2'],
    'vegetarian': ['Cheese', 'Gribnaya', 'Tomato', 'Italian_x2'],
    'sea_products': ['Venecia'],
    'mushroom': ['Gribnaya'],
};

for(let pizzaHeader of document.querySelectorAll('.pizza__item__header')){
    const pizzaName = pizzaHeader.textContent.replace(' ', '_');
    allPizzas[pizzaName] = document.querySelector(`#${pizzaName}`);
}

function sortPizzas(e){
    const chosenPizzas = sortings[document.querySelector('#' + this.getAttribute('for')).value];
    const allPizzasList = sortings['all'];
    for(let pizza of allPizzasList){
        if(!chosenPizzas.includes(pizza)){
            allPizzas[pizza].classList.add('pizza__item__gray');
        }
        else{
            allPizzas[pizza].classList.remove('pizza__item__gray');
        }
    }
}

for(let sortButton of document.querySelectorAll('.label__pizza_types')){
    sortButton.addEventListener('click', sortPizzas);
}

// burger
const burger = document.querySelector('.burger');
const burgerMenu = document.querySelector('.burger__menu');

function openMenu(e){
    burger.classList.toggle('burger__opened');
    burgerMenu.classList.toggle('menu__closed');
}

burger.addEventListener('click', openMenu);