import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { getUserSpotsThunk } from '../../store/spots';
import * as spotActions from '../../store/spots';
import './UserSpots.css';

function UserSpots() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);
    const [spots, setSpots] = useState([]);

    useEffect(() => {
        const getUserSpots = async () => {
            const response = await dispatch(spotActions.getUserSpotsThunk(user.id));
            setSpots(response.Spots);
        };

        if (user) {
            getUserSpots();
        }
    }, [dispatch, user]);


    return (
        <div>
            <h2>Manage Your Spots</h2>
            {spots.length === 0 && (
                <div id='create-spot-button'>
                    <button onClick={() => window.location.href = '/create-spot'}>
                        Create a New Spot
                    </button>
                </div>
            )}
            <div className='spot-tile-container'>
                {spots.map(spot => (
                    <div className='spot-tile'
                        key={spot.id}
                        onClick={() => window.location.href = `/spots/${spot.id}`}>
                        <img src={spot.previewImage} alt={spot.name} id='spot-tile-image' />
                        <div id='spot-city-state'>{spot.city}, {spot.state}
                            <div title={spot.name} >
                                <i className="fas fa-star"></i>
                                {spot.numReviews && spot.numReviews.length === 0 ? 'New' : (spot.avgRating ? spot.avgRating.toFixed(1) : "New")}
                            </div>
                        </div>
                        <div id='spot-tile-price'>
                            <div id='tile-price'>${spot.price}</div>
                            night
                        </div>
                        <div id='update-spot-container'>
                            <button id='update-spot-button' onClick={(e) => {
                                e.preventDefault();
                                window.location.href = `/spots/${spots.id}/edit`
                            }}>
                                Update
                            </button>
                        </div>
                        <div id='delete-spot-button'>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

}

export default UserSpots
