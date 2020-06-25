const modalOverlay = document.querySelector('.modal-overlay');
const cards = document.querySelectorAll('.card');

for (let card of cards) {
    card.addEventListener('click', function() {
        const id = card.getAttribute('id');

        modalOverlay.querySelector('img').src = `./assets/${id}.png`;
        modalOverlay.classList.add('active');

        modalOverlay.querySelector('.modal-name').innerHTML = card.querySelector('.card-name').innerHTML;
        modalOverlay.querySelector('.modal-autor').innerHTML = card.querySelector('.card-autor').innerHTML;
    })
}

modalOverlay.querySelector('.close-modal').addEventListener('click', function() {
    modalOverlay.classList.remove('active');
    modalOverlay.querySelector('img').src = '';
})