const card = document.querySelector('.recipe');
const btnIngre = document.querySelector('#btn-ingredient');
const btnPrep = document.querySelector('#btn-preparation');
const btnInfo = document.querySelector('#btn-info');

btnIngre.addEventListener('click', () => {
  const cardIngredient = document.querySelector('.card__ingredient');

  if (cardIngredient.classList.contains('show-info__active')) {
    cardIngredient.classList.remove('show-info__active');
    btnIngre.innerHTML = 'Mostrar';
  } else {
    cardIngredient.classList.add('show-info__active');
    btnIngre.innerHTML = 'Esconder';
  }
});

btnPrep.addEventListener('click', () => {
  const cardPreparation = document.querySelector('.card__preparation');

  if (cardPreparation.classList.contains('show-info__active')) {
    cardPreparation.classList.remove('show-info__active');
    btnPrep.innerHTML = 'Mostrar';
  } else {
    cardPreparation.classList.add('show-info__active');
    btnPrep.innerHTML = 'Esconder';
  }
});

btnInfo.addEventListener('click', () => {
  const cardInfo = document.querySelector('.text-info');

  if (cardInfo.classList.contains('show-info__active')) {
    cardInfo.classList.remove('show-info__active');
    btnInfo.innerHTML = 'Mostrar';
  } else {
    cardInfo.classList.add('show-info__active');
    btnInfo.innerHTML = 'Esconder';
  }
});
