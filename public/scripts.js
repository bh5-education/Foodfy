const currentpage = location.pathname;
const menuItems = document.querySelectorAll('header #links a');

for (let item of menuItems) {
  if (currentpage.includes(item.getAttribute('href')))
    item.classList.add('active');

  if (currentpage.includes('/chefs')) {
    document.querySelector('#filter-form').style.display = 'none';
  }
}
