// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import * as spotActions from "../../store/spots";

// function SpotDetail() {
//   const { spotId } = useParams();

//   const [spot, setSpot] = useState({
//     id: "",
//     ownerId: '',
//     address: "",
//     city: "",
//     state: "",
//     country: "",
//     imageUrl: "",
//     description: "",
//     Owner: { firstName: "", lastName: "" },
//   });

//   useEffect(() => {
//     fetch(`/api/spots/${spotId}`)
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.spot !== undefined) {
//           setSpot(data.spot);
//         }
//         // console.log('data: ', data);
//         // console.log('data.spot: ', data.spot);
//         // console.log('spot: ', spot);
//         // console.log('spotId:', spotId)
//       });
//   }, [spotId]);

//   useEffect(() => {
//     // console.log('spot:', spot);
//   }, [spot]);

//   return (
//     <div>
//       {spot && spot.id ? (
//         <div className="spot-name-loc-detail">
//           <h2>{spot.name}</h2>
//           <h3>
//             Location: {spot.city}, {spot.state}, {spot.country}
//           </h3>
//           <div>
//             <img src={spot.imageUrl} alt={spot.name} />
//           </div>
//           <p>{spot.description}</p>
//           <p>Hosted by: {spot.ownerId.firstName} {spot.ownerId.lastName}</p>
//         </div>
//       ) : (
//         <div>
//           <h2>Loading...</h2>
//         </div>
//       )}
//     </div>
//   );
// }

// export default SpotDetail;


import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as spotActions from '../../store/spots'
import './SpotDetail.css'


function SpotDetail() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const [currentSpot, setCurrentSpot] = useState(null);
  const [reviews, setReviews] = useState([]);



  useEffect(() => {
    const reserveBtn = document.getElementById('reserve');
    if (reserveBtn) {
      reserveBtn.addEventListener('click', handleClick);
    }

    return () => {
      if (reserveBtn) {
        reserveBtn.removeEventListener('click', handleClick);
      }
    };
  }, []);

  useEffect(() => {
    dispatch(spotActions.getCurrentSpotThunk(spotId))
      .then(currentSpot => setCurrentSpot(currentSpot))
      .catch(err => console.log(err));
  }, [dispatch, spotId]);


  function handleClick() {
    alert('Feature coming soon');
  }

  // useEffect(() => {
  //   fetch('/api/:spotId/reviews')
  //     .then(res => res.json())
  //     .then(data => setReviews(data))
  //     .catch(err => console.log(err));
  // }, []);

  useEffect(() => {
    dispatch(spotActions.getReviewsThunk(spotId))
      .then(reviews => setReviews(reviews.Reviews))
      .catch(err => console.log(err));
  }, [dispatch, spotId])

  return (
    <div>
      {currentSpot ? (
        <div>
          <div className="spot-name-loc-detail">
            <div id='spot-detail-info'>
              <h2>{currentSpot?.name}</h2>
              <h3>
                Location: {currentSpot?.city}, {currentSpot?.state}, {currentSpot?.country}
              </h3>
              <div>
                <img src={currentSpot?.imageUrl} alt={currentSpot?.name} />
              </div>
              <p>Hosted by: {currentSpot.Owner.firstName} {currentSpot.Owner.lastName}</p>
              <p>{currentSpot?.description}</p>
            </div>
            <div id='rating-review-box'>
              <div id='test'>
                <div id='rating-review'>
                  <div id='price'>
                    <p>Price: ${currentSpot?.price} /night</p>
                  </div>
                  <div id='stars-review'>
                    <div id='stars'>
                      {currentSpot?.numReviews > 0 ?
                        <p>⭐️{currentSpot?.avgStarRating.toFixed(1)}</p> :
                        <p>⭐️New</p>
                      }
                    </div>
                    {currentSpot?.numReviews > 0 &&
                      <>
                        <div className='centered-dot'><p>·</p></div>
                        <div id='reviews'>
                          <p>#{currentSpot?.numReviews} {currentSpot?.numReviews === 1 ? 'Review' : 'Reviews'}</p>
                        </div>
                      </>
                    }
                  </div>
                </div>
                <div id='reserve-button'>
                  <button id='reserve' onClick={handleClick}>Reserve</button>
                </div>
              </div>
            </div>
          </div>
          <div id='reviews-box'>
            <div id='stars-review'>
              <div id='stars'>
                {currentSpot?.numReviews > 0 ?
                  <p>⭐️{currentSpot?.avgStarRating.toFixed(1)}</p> :
                  <p>⭐️New</p>
                }
              </div>
              {currentSpot?.numReviews > 0 &&
                <>
                  <div className='centered-dot'><p>·</p></div>
                  <div id='reviews'>
                    <p>#{currentSpot?.numReviews} {currentSpot?.numReviews === 1 ? 'Review' : 'Reviews'}</p>
                  </div>
                </>
              }
            </div>
          </div>
          <div id='review-map'>
            {Array.isArray(reviews) && reviews.map(review => (
              <div key={review.id}>
                <p id='first-name'>{review.firstName}</p>
                <p>{review.createdAt}</p>
                <p>{review.review}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default SpotDetail;
