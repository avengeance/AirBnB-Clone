import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as spotActions from '../../store/spots'
import './Spots.css'

function Spots() {
    // Create a state to store all of the spots
    // const spots = useSelector(state => state.spots.spots.Spots)
    const [spots, setSpots] = useState([])
    const dispatch = useDispatch()

    // Create a useEffect to fetch the spots data from your backend API
    useEffect(() => {
        fetch('/api/spots')
            .then(res => res.json())
            .then(data => {
                const spotsArr = data.Spots
                setSpots(spotsArr)
            })
    }, [])

    // This function is called when a spot tile is hovered over
    const tileHover = (event, spotName) => {
        // Find the tooltip element and set its text content to the spot name
        const tooltip = document.getElementById('spot-tooltip')
        tooltip.textContent = spotName
        tooltip.style.display = 'block'; // Show the tooltip

        // // Position the tooltip under the cursor
        const x = event.clientX;
        const y = event.clientY;
        tooltip.style.top = `${y + 10}px`; // Add 10 pixels to position the tooltip slightly below the cursor
        tooltip.style.left = `${x}px`;
    }


    return (
        <div className='spot-tile-container'>
            {spots.map(spot => (
                <div className='spot-tile'
                    key={spot.id}
                    onMouseOver={(event) => tileHover(event, spot.name)} // Call handleTileHover when the tile is hovered over
                    onMouseOut={() => {
                        const tooltip = document.getElementById('spot-tooltip')
                        tooltip.textContent = ''; // Clear the tooltip text when the mouse leaves the tile
                    }}
                    onClick={() => window.location.href = `/spots/${spot.id}`}>
                    <img src={spot.previewImage} alt={spot.name} id='spot-tile-image' />
                    <div id='spot-city-state'>{spot.city}, {spot.state}
                        <div title={spot.name} >
                            <i className="fas fa-star"></i>
                            {spot.numReviews && spot.numReviews.length === 0 ? 'New' : (spot.avgRating ? spot.avgRating.toFixed(1) : "New")}
                        </div>
                    </div>
                    <div id='spot-tile-price'>
                        <div id='tile-price'>{spot.price}</div>
                        night
                    </div>
                </div>
            ))}
            <div id='spot-tooltip'>{/*Create an empty tooltip element to display when a spot tile is hovered over*/}</div>
        </div>
    );
}

export default Spots
