import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as spotActions from "../../store/spots";
import { useHistory } from "react-router-dom";
import { useRef } from "react";
import { useModal } from "../../context/Modal";
import "./DeleteSpot.css";

const DeleteModal = ({ spotId }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const modalRef = useRef(null);

    const spots = useSelector((state) => (state.spots.spots.Spots));

    const { closeModal } = useModal();

    const deleteSpot = async () => {
        if (spots.length > 0) {
            const currentSpot = spots.find((spot) => spot.id === spotId)
            await dispatch(spotActions.deleteSpotThunk(spotId));
            history.push('/spots/current');
        }
    }

    function handleNoClick() {
        closeModal()
    }

    return (
        <>

            <form onsubmit={deleteSpot}>
                <div className='confirm-container' ref={modalRef}>
                    <h1 >Confirm Delete</h1>
                    <p id="confirm">Are you sure you want to delete this spot?</p>
                    <div className="confirm-container">
                        <button className="confirm-button" onClick={deleteSpot}>Yes (Delete Spot)</button>
                        <button className="deny-button" onClick={handleNoClick}>No (Keep Spot)</button>
                    </div>
                </div >
            </form>
        </>
    )
}

export default DeleteModal;
