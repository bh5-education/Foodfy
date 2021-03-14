const cards = document.querySelectorAll('.card');

for (let i = 0; i < cards.length; i++) {
  cards[i].addEventListener('click', () => {
    const id = i;

    window.location.href = `/recipes/${id}`;
  });
}
