import React from 'react'
import Spot from './Spot'
import './Spots.css'

function Spots({ spots }) {

    // spots is an object and we need to convert it to an array
    const spotsArray = spots ? Object.keys(spots).map(key => {
        return { ...spots[key] }
    }) : []


    return (
        <div>
            {spotsArray.map(spot => (
                <Spot key={spot.id} spot={spot} />
            ))}
        </div>
    );
}

export default Spots
