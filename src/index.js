import './css/styles.css';
import './js/fetchCountries';
import fetchCountries from './js/fetchCountries.js';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';

const refs = {
  inputEL: document.querySelector('#search-box'),
  listEl: document.querySelector('.country-list'),
  divEl: document.querySelector('.country-info'),
};

const DEBOUNCE_DELAY = 300;

// const clearMarkup = () => {
//   refs.divEl.innerHTML = '';
//   refs.listEl.innerHTML = '';
// };
const clearMarkup = element => (element.innerHTML = '');

function onIpnutChange(event) {
  refs.inputEL.classList.remove('invalid');
  refs.inputEL.classList.remove('search');

  const inputText = event.target.value.trim();
  clearMarkup(refs.listEl);
  clearMarkup(refs.divEl);
  if (!inputText) {
    return;
  }
  fetchCountries(inputText)
    .then(data => {
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        refs.inputEL.classList.add('search');
        return;
      }
      renderMarkup(data);
    })
    .catch(() => {
      Notify.failure('Oops, there is no country with that name');
      refs.inputEL.classList.add('invalid');
    });
}
const renderMarkup = data => {
  if (data.length === 1) {
    refs.divEl.insertAdjacentHTML('afterbegin', createInfoMarkup(data));
  } else {
    refs.listEl.insertAdjacentHTML('afterbegin', createListMarkup(data));
  }
};

const createListMarkup = data => {
  return data
    .map(
      ({ name: { official }, flags: { svg } }) =>
        `<li><img src="${svg}" alt="${official}" width="40" height="30">${official}</li>`
    )
    .join('');
};

const createInfoMarkup = data => {
  return data.map(
    ({ name: { official }, capital, population, flags: { svg }, languages }) =>
      `<h1><img src="${svg}" alt="${official}" width="60" height="40">${official}</h1>
      <p><strong>Capital:</strong> ${capital}</p>
      <p><strong>Population:</strong> ${population}</p>
      <p><strong>Languages:</strong> ${Object.values(languages)}</p>`
  );
};

refs.inputEL.addEventListener('input', debounce(onIpnutChange, DEBOUNCE_DELAY));
