import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function SpotDetail() {
  const { spotId } = useParams();

  const [spot, setSpot] = useState(null);

  useEffect(() => {
    fetch(`/api/spots/${spotId}`)
      .then((res) => res.json())
      .then((data) => {
        setSpot(data.spot);
      });
  }, [spotId]);

  return (
    <div>
      {spot ? (
        <div>
          <h2>{spot.name}</h2>
          <h3>
            Location: {spot.city}, {spot.state}, {spot.country}
          </h3>
          <div>
            <img src={spot.imageUrl} alt={spot.name} />
          </div>
          <p>{spot.description}</p>
          <p>Hosted by: {spot.ownerId.firstName} {spot.ownerId.lastName}</p>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default SpotDetail;
