import '@babel/polyfill';
import getSessionData from '../dependencies/stripe'
import showMap from '../dependencies/mapbox'
import {showLoader} from '../component/loader'

const displayMap = document.getElementById('map');
const bookingButton = document.getElementById('booking-btn');
const starButton = document.querySelectorAll('.cta__rating svg')

showMap(JSON.parse(displayMap.dataset.location));

if(bookingButton) {
     bookingButton.addEventListener('click', e => {
          e.target.textContent = 'Proccessing...';
          showLoader(`.${e.target.classList[1]}`)
          const { tourId } = e.target.dataset;
          getSessionData(tourId);
     });
}
// const htmlMarkUp = `
//      <textarea class="review__message" placeholder="say something about this tour"></textarea>
// `

// if(starButton) {
//      Array.from(starButton).forEach((el,i) => {
//           el.addEventListener('click', e => {
//                for(let k = 0; k <= i; k++) {
//                     starButton[k].classList.add('reviews__star--active')
//                     starButton[k].classList.remove('reviews__star--inactive')
//                }
//                document.querySelector('.cta__content h2').style.display = 'none'
//                document.querySelector('.cta__content p').style.display = 'none'
//                document.querySelector('.cta').style.padding = '5rem 5rem 5rem 21rem'
//                document.querySelector('.cta__content')
//                     .insertAdjacentHTML('beforeend', htmlMarkUp)
//                el.removeEventListener('click', () => {})
//           })
//      })
// }