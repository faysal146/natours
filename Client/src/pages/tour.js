import '@babel/polyfill';
import getSessionData from '../dependencies/stripe'
import showMap from '../dependencies/mapbox'
import {showLoader} from '../component/loader'

const displayMap = document.getElementById('map');
const bookingButton = document.getElementById('booking-btn');

showMap(JSON.parse(displayMap.dataset.location));

bookingButton.addEventListener('click', e => {
     e.target.textContent = 'Proccessing...';
     showLoader(`.${e.target.classList[1]}`)
     const { tourId } = e.target.dataset;
     getSessionData(tourId);
});

