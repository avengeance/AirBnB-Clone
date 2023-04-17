import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";
import StarRating from "../StarRating";
import * as reviewActions from "../../store/reviews";
import "./PostReview.css";

function PostReviewModal() {
    const dispatch = useDispatch();
    const currentSpot = useSelector(state => state.spots.currentSpot)
    const { closeModal } = useModal();
    const [review, setReview] = useState("");
    const [rating, setRating] = useState(0);
    const [stars, setStars] = useState([]);
    const [errors, setErrors] = useState([]);

    const history = useHistory();
    const params = useParams();

    const MIN_REVIEW_LENGTH = 10;

    const validReview = review.length >= MIN_REVIEW_LENGTH;

    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = currentSpot.id

        setErrors([]);
        await dispatch(reviewActions.addReviewThunk(review, currentSpot.id, rating))
            .then(closeModal())
            .catch((error) => {
                setErrors([...errors, errors.message])
            })
        await history.push(`/spots/${url}`)
        console.log('This is currentSpot.id: ', currentSpot.id)
    };

    return (
        <div className="review-modal">
            <div className="modal-backdrop" onClick={closeModal}></div>
            <div className="post-review-modal">
                <h1 id="post-review-text">How was your stay?</h1>
                <form onSubmit={handleSubmit}>
                    {errors.length > 0 && (
                        <ul className="error-list">
                            {errors.map((error, idx) => (<li key={idx}>{error}</li>))}
                            {!validReview && (<li>Review must be at least {MIN_REVIEW_LENGTH} characters long</li>)}
                        </ul>
                    )}
                    {/* {proxyError && (
                        <div className="error-list">
                            <li>{proxyError}</li>
                        </div>
                    )} */}
                    <label id="review-label" className="review-label">
                        <textarea
                            placeholder="Leave your review here..."
                            onChange={(e) => setReview(e.target.value)}
                            type="text"
                            id="review-input"
                            name="review"
                            value={review}
                            required
                            className="review-input"
                        />
                    </label>
                    <div id="star-rating-div">
                        <div className="star-rating">
                            <StarRating
                                rating={rating}
                                onRatingChange={(newRating) => setRating(newRating)}
                            />
                        </div>
                    </div>
                    <div className="modal-buttons">
                        <button
                            type="submit"
                            id="submit-button"
                            disabled={!validReview}
                            className="submit-button"
                        >
                            Submit Your Review
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PostReviewModal
