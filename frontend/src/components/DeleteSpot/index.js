import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as spotActions from "../../store/spots";
import { useHistory } from "react-router-dom";
import { useRef } from "react";
import "./DeleteSpot.css";

const DeleteModal = ({ spotId }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const modalRef = useRef(null);
    const [isOpen, setIsOpen] = useState(true)
    const spots = useSelector((state) => (state.spots.spots.Spots));


    const deleteSpot = async () => {

        if (spots.length > 0) {

            const currentSpot = spots.find((spot) => spot.id === spotId)

            await dispatch(spotActions.deleteSpotThunk(spotId));

            history.push('/spots/current');
        }
        setIsOpen(false)
    }

    function handleNoClick() {
        console.log('clicked')
        setIsOpen(false)
    }

    return (
        <>
            {isOpen && (

                <div className={`confirm-container ${isOpen ? 'open' : ''}`} ref={modalRef}>
                    <h1 >Confirm Delete</h1>
                    <p id="confirm">Are you sure you want to delete this spot?</p>
                    <div className="confirm-container">
                        <button className="confirm-button" onClick={deleteSpot}>Yes (Delete Spot)</button>
                        <button className="deny-button" onClick={handleNoClick}>No (Keep Spot)</button>
                    </div>
                </div >
            )}
            {!isOpen && null}
        </>
    )
}

export default DeleteModal;
