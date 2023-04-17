import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as spotActions from '../../store/spots'
import * as reviewActions from '../../store/reviews'


import { useModal } from '../../context/Modal'
import './SpotDetail.css'
import PostReviewModal from '../PostReviewModal';
import DeleteReview from '../DeleteReview';
import OpenModalButton from '../OpenModalButton';


function SpotDetail() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const [currentSpot, setCurrentSpot] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [spot, setSpot] = useState(null);
  const [preview, setPreview] = useState(null);
  const user = useSelector(state => state.session.user);
  const currentSpots = useSelector(state => state.spots.currentSpot);
  const currentReviews = useSelector(state => state.reviews.reviews.Reviews);


  // const review = useSelector(state => state.reviews.reviews.Reviews);


  const { setModalContent } = useModal();

  const history = useHistory();

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
      .then(currentSpot => {
        if (currentSpot?.Owner?.id) {
          setCurrentSpot(currentSpot);
        }
      })
      .catch(err => console.log(err));
  }, [dispatch, spotId]);


  function handleClick() {
    alert('Feature coming soon');
  }

  function handlePostReview() {
    const modalContent = <PostReviewModal onReviewSubmit={handlePostReview} />;
    history.push(`/spots/${spotId}`);
    setModalContent(modalContent);
  }



  useEffect(() => {
    if (!spotId) {
      console.error('No spotId');
      return
    }

    dispatch(spotActions.getCurrentSpotThunk(spotId))
      .then((spot) => {
        setSpot(spot);
        setPreview(spot.image);
      })
      .catch((err) => console.log(err));
  }, [dispatch, spotId]);

  useEffect(() => {
    if (!spotId) {
      console.error('No spotId');
      return
    }

    dispatch(reviewActions.getReviewsThunk(spotId))
      .then(reviews => setReviews(reviews.Reviews))
      .catch(err => console.log(err));
  }, [dispatch, spotId])

  // console.log("this is currentReviews: ", currentReviews);
  // console.log("This is currentSpot: ", currentSpot);


  return (
    <div>
      {currentSpot ? (
        <div>
          <div className="spot-name-loc-detail">
            <div id='spot-detail-info'>
              <h2>{currentSpot?.title}</h2>
              <h3>
                Location: {currentSpot?.city}, {currentSpot?.state}, {currentSpot?.country}
              </h3>
              <div className='spot-image'>
                <div id='main-spot-image'>
                  {currentSpot?.SpotImages?.find(image => image.preview === true) ?
                    <img id='preview-image' src={currentSpot.SpotImages.find(image => image.preview === true).url} alt={currentSpot.name} />
                    : null
                  }
                </div>
                <div className='spot-image-overlay'>
                  {currentSpot?.SpotImages?.filter(image => image.preview !== true).map((image, index) => (
                    <img key={index} id={`spotImage${index + 1}`} src={image.url} alt={currentSpot.name} />
                  ))}
                </div>
              </div>


              <div id='hosted-description-rating-box'>
                <div id='hosted-description'>
                  <p id='hosted'>Hosted by: {currentSpot.Owner?.firstName} {currentSpot.Owner?.lastName}</p>
                  <p id='description'>{currentSpot?.description}</p>
                </div>
                <div id='rat-rev-box'>
                  <div id='rating-review-box'>
                    <div id='test'>
                      <div id='rating-review'>
                        <div id='price'>
                          <p>Price: ${currentSpot?.price} /night</p>
                        </div>
                        <div id='stars-review'>
                          <div id='stars'>
                            {currentReviews?.length > 0 ?
                              (typeof currentSpot?.avgStarRating === 'number' ?
                                <p>⭐️{parseFloat(currentSpot?.avgStarRating.toFixed(1))}</p> :
                                <p>⭐️New</p>
                              ) :
                              <p>⭐️New</p>
                            }
                          </div>
                          {currentReviews?.length > 0 &&
                            <>
                              <div className='centered-dot'><p>·</p></div>
                              <div id='reviews'>
                                <p>#{currentReviews.length} {currentReviews.length === 1 ? 'Review' : 'Reviews'}</p>
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
              </div>
            </div>
          </div>
          <div id='reviews-box'>
            <div id='stars-review'>
              <div id='stars'>
                {currentReviews?.length > 0 ?
                  (typeof currentSpot?.avgStarRating === 'number' ?
                    <p>⭐️{(currentSpot?.avgStarRating.toFixed(1))}</p> :
                    <p>⭐️New</p>
                  ) :
                  <p>⭐️New</p>
                }
              </div>
              {currentReviews?.length > 0 &&
                <>
                  <div className='centered-dot'><p>·</p></div>
                  <div id='reviews'>
                    <p>#{currentReviews?.length} {currentReviews.length === 1 ? 'Review' : 'Reviews'}</p>
                  </div>
                </>
              }
            </div>
          </div>
          {user && reviews && !reviews.some(review => review.userId === user.id) && user.id !== currentSpots?.ownerId ? (
            <div className='post-review'>
              <button id='post-review' onClick={handlePostReview}>Post Your Review</button>
              {reviews.length > 0 ? null : <p id='no-reviews'>Be the first to post a review!</p>}

            </div>
          ) : (
            null
          )}

          <div id='review-map'>
            {Array.isArray(reviews) && reviews.length > 0 ? (
              reviews
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // sort reviews by date (newest to oldest)
                .map(review => (
                  <div key={review.id}>
                    <p id='first-name'>{review.User.firstName}</p>
                    <p id='createdAt'>{new Intl.DateTimeFormat('default', { month: 'long', year: 'numeric' }).format(new Date(review.createdAt))}</p>
                    <p id='review-description'>{review.review}</p>
                    <div className='delete-review-container'>
                      {user && review.userId === user.id && (
                        <OpenModalButton
                          buttonText={'Delete'}
                          className='delete-review-button'
                          modalComponent={<DeleteReview reviewId={review.id} />}
                        />
                      )}
                    </div>
                  </div>
                ))
            ) :

              // user && user.id !== currentSpot.Owner.id ? (
              // <p id='no-reviews'>Be the first to post a review!</p>
              // )
              // :
              (
                // render nothing if user is not logged in or is the owner of the spot
                null
              )}
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default SpotDetail;
