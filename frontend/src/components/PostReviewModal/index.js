import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/reviews";
import "./PostReview.css";

function PostReviewModal() {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [review, setReview] = useState("");
    const [errors, setErrors] = useState([]);
    const { spotId } = useParams();

    const MIN_REVIEW_LENGTH = 10;

    const validReview = review.length >= MIN_REVIEW_LENGTH;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        return dispatch(sessionActions.addReviewThunk({ spotId, review }))
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
                    <ul className="error-list">
                        {errors.map((error, idx) => (<li key={idx}>{error}</li>))}
                        {!validReview && (<li>Review must be at least {MIN_REVIEW_LENGTH} characters long</li>)}
                    </ul>
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
                    <div className="modal-buttons">
                        <button
                            type="submit"
                            id="submit-button"
                            disabled={!validReview}
                        >
                            Submit Your Review
                        </button>
                        {/* <button type="button" onClick={closeModal}>
                            Cancel
                        </button> */}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PostReviewModal
