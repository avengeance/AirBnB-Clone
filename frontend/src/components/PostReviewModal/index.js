import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import StarRating from "../StarRating";
import * as sessionActions from "../../store/reviews";
import "./PostReview.css";

function PostReviewModal() {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [review, setReview] = useState("");
    const [rating, setRating] = useState(0);
    const [stars, setStars] = useState([]);
    const [errors, setErrors] = useState([]);
    const { spotId } = useParams();

    const MIN_REVIEW_LENGTH = 10;

    const validReview = review.length >= MIN_REVIEW_LENGTH;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        return dispatch(sessionActions.addReviewThunk({ spotId, review, rating }))
            .then(closeModal)
            .catch(
                async (res) => {
                    const data = await res.json();
                    if (data && data.errors) {
                        setErrors(data.errors);
                    }
                    else {
                        setErrors(["Inputs are invalid"]);
                    }
                }
            )

        // try {
        //     await dispatch(sessionActions.addReviewThunk({ spotId, review }));
        //     closeModal();
        // } catch (err) {
        //     const errorRes = await err.json();
        //     setErrors(errorRes.errors);
        // }
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
                    <label id="review-label" className="review-label">
                        <input
                            type="text"
                            id="review-input"
                            name="review"
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="Leave your review here..."
                            required
                            className="review-input"
                        />
                    </label>
                    <div id="star-rating-div">
                        <div className="star-rating">
                            <label htmlFor="stars">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                            </label>
                            <input
                                type="range"
                                id="stars"
                                name="stars"
                                min="1"
                                max="5"
                                value={stars}
                                onChange={(e) => setStars(e.target.value)}
                                className="star-rating-input"
                            />
                            <span>{stars} stars</span>
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
