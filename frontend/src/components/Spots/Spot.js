import React from "react";

function Spot({ Spot }) {
    if (!Spot) {
        return null;
    }
    return (
        <div className="spot" key={Spot.id}>
            <h2>{Spot.name}</h2>
            <p>{Spot.description}</p>
            <p>{Spot.city}, {Spot.state}</p>
        </div>
    )
}

export default Spot
