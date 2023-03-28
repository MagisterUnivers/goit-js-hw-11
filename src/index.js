/**
  |============================
  | Imports
  |============================
*/

import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';

/**
  |============================
  | Init
  |============================
*/

const API_LINK = 'https://pixabay.com/api/';
const API_KEY = '?key=34801221-8d931700a9938476d6fb8b2c9';
const API_Q = '&q=';
const API_LINK_PARAMS =
  '&image_type=photo&orientation=horizontal&safesearch=true';
const API_LINK_PARAMS_PAGE = '&page=';
const API_LINK_PARAMS_PER_PAGE = '&per_page=40';

const refs = {
  form: document.querySelector('#search-form'),
  inputEl: document.querySelector('input'),
  searchBtn: document.querySelector('button'),
  lMoreBtn: document.querySelector('.load-more'),
  mainDiv: document.querySelector('.gallery'),
};

let inputElValue = '';
let page = 1;
refs.lMoreBtn.disabled = true;
const count = refs.mainDiv.childElementCount;

/**
  |============================
  | Code
  |============================
*/

refs.form.addEventListener('submit', async e => {
  e.preventDefault();
  inputElValue = refs.inputEl.value;

  const data = await fetchSomePic(
    API_LINK +
      API_KEY +
      API_Q +
      inputElValue +
      API_LINK_PARAMS +
      API_LINK_PARAMS_PAGE +
      page +
      API_LINK_PARAMS_PER_PAGE
  );
  console.log(data);

  if (inputElValue.length === 0) {
    refs.mainDiv.innerHTML = data.hits.map(elem => createPic(elem)).join('');
    Notiflix.Notify.warning(
      'You are not described the search. We will find something for you.'
    );
  } else if (data.hits.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    refs.mainDiv.innerHTML = data.hits.map(elem => createPic(elem)).join('');
    refs.lMoreBtn.disabled = false;
  }
});

refs.lMoreBtn.addEventListener('click', async () => {
  page += 1;
  const data = await fetchSomePic(
    API_LINK +
      API_KEY +
      API_Q +
      inputElValue +
      API_LINK_PARAMS +
      API_LINK_PARAMS_PAGE +
      page +
      API_LINK_PARAMS_PER_PAGE
  );
  console.log(data);
  if (page === 3)
    Notiflix.Notify.warning(
      'Beware, many images can make your browsing a little bit slower'
    );

  refs.mainDiv.insertAdjacentHTML(
    'beforeend',
    data.hits.map(elem => createPic(elem)).join('')
  );
});

/**
  |============================
  | Functions
  |============================
*/

async function fetchSomePic(searchName) {
  try {
    const response = await fetch(`${searchName}`);
    if (response.ok) {
      const resultData = await response.json();
      return resultData;
    } else {
      throw new Error(response.status);
    }
  } catch (error) {
    Notiflix.Notify.failure(
      `"Sorry, there are no images matching your search query. Please try again.": ${error}`
    );
    return error;
  }
}

function createPic(picture) {
  return `<div class="photo-card">
  <img src="${picture.webformatURL}" alt="${picture.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>${picture.likes}</b>
    </p>
    <p class="info-item">
      <b>${picture.views}</b>
    </p>
    <p class="info-item">
      <b>${picture.comments}</b>
    </p>
    <p class="info-item">
      <b>${picture.downloads}</b>
    </p>
  </div>
</div>`;
}
