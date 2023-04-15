import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { getUserSpotsThunk } from '../../store/spots';
import { Link } from 'react-router-dom';
import * as spotActions from '../../store/spots';
import OpenModalButton from '../OpenModalButton';
import DeleteModal from '../DeleteSpot';
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
            <div>
                <h2>Manage Your Spots</h2>
                {spots.length === 0 && (
                    <div id='create-spot-button'>
                        <Link to={`/spots/new`} id='spot-button'>
                            Create a New Spot
                        </Link>
                    </div>
                )}
                <div className='spot-tile-container'>
                    {spots.map(spot => (
                        <div className='spot-tile'
                            key={spot.id}>
                            <img
                                src={spot.previewImage}
                                alt={spot.name}
                                id='spot-tile-image'
                                onClick={() => window.location.href = `/spots/${spot.id}`}
                            />
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
                            <div id='update-delete-container'>
                                <div id='update-spot-container'>
                                    <Link to={`/spots/${spot.id}/edit`} id='update-spot-button'>Update</Link>
                                </div>
                                <div id='delete-spot-container'>
                                    <OpenModalButton
                                        buttonText={'Delete'}
                                        className='delete-spot-button'
                                        modalComponent={<DeleteModal />}
                                        style={{
                                            backgroundColor: '#3A3A3A !important',
                                        }}
                                    />
                                    {/* <Link to={`/spots/${spot.id}/delete`} id='delete-spot-button'>Delete</Link> */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )

}

export default UserSpots
