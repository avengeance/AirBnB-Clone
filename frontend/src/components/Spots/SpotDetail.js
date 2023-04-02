// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import * as spotActions from "../../store/spots";

// function SpotDetail() {
//   const { spotId } = useParams();

//   const [spot, setSpot] = useState({
//     id: "",
//     ownerId: '',
//     address: "",
//     city: "",
//     state: "",
//     country: "",
//     imageUrl: "",
//     description: "",
//     Owner: { firstName: "", lastName: "" },
//   });

//   useEffect(() => {
//     fetch(`/api/spots/${spotId}`)
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.spot !== undefined) {
//           setSpot(data.spot);
//         }
//         // console.log('data: ', data);
//         // console.log('data.spot: ', data.spot);
//         // console.log('spot: ', spot);
//         // console.log('spotId:', spotId)
//       });
//   }, [spotId]);

//   useEffect(() => {
//     // console.log('spot:', spot);
//   }, [spot]);

//   return (
//     <div>
//       {spot && spot.id ? (
//         <div className="spot-name-loc-detail">
//           <h2>{spot.name}</h2>
//           <h3>
//             Location: {spot.city}, {spot.state}, {spot.country}
//           </h3>
//           <div>
//             <img src={spot.imageUrl} alt={spot.name} />
//           </div>
//           <p>{spot.description}</p>
//           <p>Hosted by: {spot.ownerId.firstName} {spot.ownerId.lastName}</p>
//         </div>
//       ) : (
//         <div>
//           <h2>Loading...</h2>
//         </div>
//       )}
//     </div>
//   );
// }

// export default SpotDetail;


import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as spotActions from '../../store/spots'


function SpotDetail() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const [currentSpot, setCurrentSpot] = useState(null);

  useEffect(() => {
    dispatch(spotActions.getCurrentSpotThunk(spotId))
      .then(currentSpot => setCurrentSpot(currentSpot))
      .catch(err => console.log(err));
  }, [dispatch, spotId]);


  return (
    <div>
      {currentSpot ? (
        <div className="spot-name-loc-detail">
                   <h2>{currentSpot?.name}</h2>
                   <h3>
                    Location: {currentSpot?.city}, {currentSpot?.state}, {currentSpot?.country}
                   </h3>
                   <div>
                    <img src={currentSpot?.imageUrl} alt={currentSpot?.name} />
                  </div>
                   <p>{currentSpot?.description}</p>
                   <p>Hosted by: {currentSpot.Owner.firstName} {currentSpot.Owner.lastName}</p>
                 </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default SpotDetail;
