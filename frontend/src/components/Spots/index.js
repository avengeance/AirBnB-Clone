import React, { useEffect, useState } from 'react'
import './Spots.css'

function Spots() {
    // Create a state to store all of the spots
    const [spots, setSpots] = useState([])

    // Create a useEffect to fetch the spots data from your backend API
    useEffect(() => {
        fetch('/api/spots')
            .then(res => res.json())
            .then(data => {
                console.log(data)
                const spotsArr = Object.values(data)
                setSpots(spotsArr)
            })
    }, [])



    return (
        <div className='spot-tile-container'>
            {spots.map(spot => (
                <div className='spot-tile' key={spot.id}>
                    <img src={spot.imageUrl} alt={spot.name} />
                    <div>{spot.city}, {spot.state}
                    </div>
                    <div title={spot.name}>
                        {spot.reviews && spot.reviews.length === 0 ? 'New' : (spot.averageRating ? spot.averageRating.toFixed(1) : "No reviews")}
                    </div>
                    <div>
                        {spot.price}/night
                    </div>
                    <div onClick={() => window.location.href = `/spots/${spot.id}`}>
                        Click here for more details
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Spots
