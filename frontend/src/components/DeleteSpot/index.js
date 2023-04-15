import React from "react";
import { useDispatch, useSelector } from "react-redux";
import * as spotActions from "../../store/spots";
import { useHistory } from "react-router-dom";
import { useRef } from "react";
import "./DeleteSpot.css";

const DeleteModal = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const modalRef = useRef(null);
    const spots = useSelector((state) => Object.values(state.spots.spots));
    const currentSpot = useSelector((state) => state.spots.spots.Spots);

    const deleteSpot = () => {
        console.log(currentSpot.id)
        dispatch(spotActions.deleteSpotThunk(currentSpot.id));
        history.push('/spots/current');
    }

    return (
        <div className="confirm-container" ref={modalRef}>
            <h1 >Confirm Delete</h1>
            <p id="confirm">Are you sure you want to delete this spot?</p>
            <div className="confirm-container">
                <button className="confirm-button" onClick={deleteSpot}>Yes (Delete Spot)</button>
                <button className="deny-button">No (Keep Spot)</button>
            </div>
        </div >
    )
}

export default DeleteModal;
