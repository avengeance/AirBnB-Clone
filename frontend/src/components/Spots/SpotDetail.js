import React from "react";
import {useParams} from "react-router-dom";

function Spot() {
    const { spotId } = useParams();
    
    return (
        <div className="spot" key={Spot.id}>
            <h2>{Spot.name}</h2>
            <p>{Spot.description}</p>
            <p>{Spot.city}, {Spot.state}</p>
        </div>
    )
}

export default Spot
