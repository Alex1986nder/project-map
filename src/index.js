// import './index.html';
// import './style.css';
import { templates } from './js/templates';

ymaps.ready(init);
let myMap, placemark, coords, clusterer;

function init() {
  myMap = new ymaps.Map(
    'map',
    {
      center: [55.752296, 37.602629],
      zoom: 14,
    },
    {
      balloonMinWidth: 250,
    }
  );

  myMap.events.add('click', function (e) {
    let coords = e.get('coords');
    myMap.balloon.open(coords, {
      content:
        '<div id = "review__list"; style = "height: 100px; overflow: scroll;"></div>' +
        templates,
    });
  });

  clusterer = new ymaps.Clusterer({
    groupByCoordinates: true,
    clusterDisableClickZoom: true,
    clusterOpenBalloonOnClick: false,
  });

  clusterer.events.add('click', (e) => {
    const coords = e.get('target').geometry.getCoordinates();
    openBaloon(coords);
  });

  let storage = JSON.parse(localStorage.getItem('reviews')) || [];
  
  renderPlacemark();
  
  function renderPlacemark() {
    storage.forEach((reviews) => {
      createPlacemark(reviews.coords);
    });
  }
  let arr = localStorage.getItem('reviews')
    ? JSON.parse(localStorage.getItem('reviews'))
    : [];

  document.body.addEventListener('click', onClick);

  myMap.events.add('click', function (e) {
    return (coords = e.get('coords'));
  });

  function onClick(e) {
    if (e.target.id === 'btn') {
      const myName = document.querySelector('#myName');
      const place = document.querySelector('#place');
      const review = document.querySelector('#review');

      const newReview = {
        coords: coords,
        reviews: {
          name: myName.value,
          place: place.value,
          review: review.value,
        },
      };
      arr.push(newReview);
      localStorage.setItem('reviews', JSON.stringify(arr));
      createPlacemark(coords);
      myMap.balloon.close();
    }
  }

  function openBaloon(coords, storage) {
    storage = JSON.parse(localStorage.getItem('reviews')) || [];
    let reviewList = '';
    for (const review of storage) {
      // console.log(review)
      if (JSON.stringify(review.coords) === JSON.stringify(coords)) {
        reviewList += `<div><b>${review.reviews.name}</b>[${review.reviews.place}]</div><div>${review.reviews.review}</div>`;
        // console.log(JSON.stringify(review.coords), JSON.stringify(coords));
        myMap.balloon.open(review.coords, {
          content:
            `<div id = "review__list"; style = "height: 100px; overflow: scroll;"><div>${reviewList}</div></div>` +
            templates,
        });
        console.log(reviewList);
      }
    }
  }
  function createPlacemark(coords, reviews) {
    placemark = new ymaps.Placemark(coords);
    placemark.events.add('click', (e) => {
      const coords = e.get('target').geometry.getCoordinates();

      openBaloon(coords);
    });
    clusterer.add(placemark);
    myMap.geoObjects.add(clusterer);
  }
}

