/**
  |============================
  | Imports
  |============================
*/

import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

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
let loadedImagesCount = 0;
refs.lMoreBtn.disabled = true;
const count = refs.mainDiv.childElementCount;

/**
  |============================
  | Code
  |============================
*/

refs.form.addEventListener('submit', async e => {
  e.preventDefault();
  inputElValue = refs.inputEl.value.trim();

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

  page = 1;
  loadedImagesCount = 0;

  Notiflix.Notify.warning(`Hooray! We found ${data.totalHits} images.`);

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
    loadedImagesCount += data.hits.length;
  }

  if (loadedImagesCount >= data.totalHits) {
    refs.mainDiv.insertAdjacentHTML(
      'beforeend',
      data.hits.map(elem => createPic(elem)).join('')
    );
    Notiflix.Notify.failure(
      `We're sorry, but you've reached the end of search results. Last of them was loaded to the page`
    );
    refs.lMoreBtn.classList.add('hide');
  } else {
    refs.mainDiv.insertAdjacentHTML(
      'beforeend',
      data.hits.map(elem => createPic(elem)).join('')
    );
    refs.lMoreBtn.classList.remove('hide');
  }

  const lightbox = new SimpleLightbox('.gallery a', {
    /* options */
    // widthRatio: 0.5,
    // heightRatio: 0.5,
    // scaleImageToRatio: true,
    // maxZoom: 10,
  });
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

  const lightbox = new SimpleLightbox('.gallery a', {
    /* options */
    // widthRatio: 0.5,
    // heightRatio: 0.5,
    // scaleImageToRatio: true,
    // maxZoom: 10,
  });

  if (page === 3) {
    Notiflix.Notify.warning(
      'Beware, many images can make your browsing a little bit slower'
    );
  } else if (loadedImagesCount >= 100) {
    Notiflix.Notify.warning(
      'You have reached 100 images. Consider refining your search to avoid slowing down the page.'
    );
  }

  loadedImagesCount += data.hits.length;
  console.log(loadedImagesCount);

  if (loadedImagesCount >= data.totalHits) {
    refs.mainDiv.insertAdjacentHTML(
      'beforeend',
      data.hits.map(elem => createPic(elem)).join('')
    );
    Notiflix.Notify.failure(
      `We're sorry, but you've reached the end of search results. Last of them was loaded to the page`
    );
    refs.lMoreBtn.classList.add('hide');
  } else {
    refs.mainDiv.insertAdjacentHTML(
      'beforeend',
      data.hits.map(elem => createPic(elem)).join('')
    );
    refs.lMoreBtn.classList.remove('hide');
  }

  lightbox.refresh();
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
  return `<div class="photo-card"><a href="${picture.largeImageURL}">
  <img src="${picture.webformatURL}" alt="${picture.tags}" loading="lazy" width=500 heigth=500/></a>
  <div class="info">
    <p class="info-item">
      <b>Likes
      ${picture.likes}</b>
    </p>
    <p class="info-item">
      <b>Views
      ${picture.views}</b>
    </p>
    <p class="info-item">
      <b>Comments
      ${picture.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads
      ${picture.downloads}</b>
    </p>
  </div>
</div>`;
}
