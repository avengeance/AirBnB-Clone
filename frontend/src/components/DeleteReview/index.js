import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as reviewActions from "../../store/reviews";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";

const DeleteReview = ({ reviewId }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const modalRef = useRef(null);
    const [isOpen, setIsOpen] = useState(true)

    const spots = useSelector((state) => (state.spots.spots.Spots));
    const review = useSelector((state) => (state.reviews.reviews.Reviews));

    const { closeModal } = useModal();

    const deleteReview = async (e) => {
        if (review.length > 0) {
            const currentSpotReview = spots.find((spot) => spot.id === reviewId)
            await dispatch(reviewActions.deleteReviewThunk(reviewId));
            history.push('/spots/current');
        }
        // setIsOpen(false)
        // e.preventDefault();
        // const review = review.find(review => review.id === parseInt(reviewId))
        // console.log('this is review', review)
        // await dispatch(reviewActions.deleteReviewThunk(review)).then(closeModal);
    }

    function handleNoClick() {
        closeModal()
    }

    return (
        <>
            {/* {isOpen && ( */}
            <form onSubmit={deleteReview}>
                <div className="confirm-container" ref={modalRef}>
                    <h1 >Confirm Delete</h1>
                    <p id="confirm">Are you sure you want to delete this review?</p>
                    <div className="confirm-container">
                        <button type='submit' className="confirm-button">Yes (Delete Review)</button>
                        <button className="deny-button" onClick={handleNoClick}>No (Keep Review)</button>
                    </div>
                </div>
            </form>
            {/* )} */}
            {/* {isOpen && null} */}
        </>
    )

}

export default DeleteReview
