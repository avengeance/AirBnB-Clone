import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function SpotDetail() {
  const { spotId } = useParams();

  const [spot, setSpot] = useState({
    id: "",
    ownerId: '',
    address: "",
    city: "",
    state: "",
    country: "",
    imageUrl: "",
    description: "",
    Owner: { firstName: "", lastName: "" },
  });

  useEffect(() => {
    fetch(`/api/spots/${spotId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.spot !== undefined) {
          setSpot(data.spot);
        }
        console.log('data: ', data);
        console.log('data.spot: ', data.spot);
        console.log('spot: ', spot);
        console.log('spotId:', spotId)
      });
  }, [spotId]);

  useEffect(() => {
    console.log('spot:', spot);
  }, [spot]);

  return (
    <div>
      {spot && spot.id ? (
        <div className="spot-name-loc-detail">
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
        // <div>Loading...</div>
        <div id="spot-box">
          <div className="create-spot-form">
            <h2 id="create-text">Create a new Spot</h2>
            <h3 id="question-text">Where's your place located?</h3>
            <p id="description">Guests will only get your exact address once they booked a reservation</p>
            <div>
              <form className="form">
                <div id="form-location">
                  <label id="country-label"><p>Country</p>
                    <input type="text"
                      id="country-input"
                      name="country"
                      value={spot.country}
                      onChange={(e) => {
                        setSpot({ ...spot, country: e.target.value });
                      }}
                      placeholder="Country"
                      style={({
                        width: "98%",
                        backgroundColor: "lightgrey"
                      })}
                    />
                  </label>
                  <label id='street-label'><p>Street Address</p>
                    <input type="text"
                      id="street-input"
                      name="street"
                      value={spot.address}
                      onChange={(e) => {
                        setSpot({ ...spot, address: e.target.value });
                      }}
                      placeholder="Address"
                      style={({
                        width: "98%",
                        backgroundColor: "lightgrey"
                      })}
                    />
                  </label>
                  <div id="city-state-label">
                    <label id='city-label'><p>City</p>
                      <input type="text"
                        id="city-input"
                        name="city"
                        value={spot.city}
                        onChange={(e) => {
                          setSpot({ ...spot, city: e.target.value });
                        }}
                        placeholder="City"
                        style={{
                          width: "90%",
                          backgroundColor: "lightgrey"
                        }}
                      />,
                    </label>
                    <label id='state-label'><p>State</p>
                      <input type="text"
                        id="state-input"
                        name="state"
                        value={spot.state}
                        onChange={(e) => {
                          setSpot({ ...spot, state: e.target.value });
                        }}
                        placeholder="STATE"
                        style={({
                          width: "94%",
                          backgroundColor: "lightgrey"
                        })}
                      />
                    </label>
                  </div>
                  <div id="lat-long-label">
                    <label id='lat-label'><p>Latitude</p>
                      <input type="text"
                        id="lat-input"
                        name="lat"
                        value={spot.lat}
                        onChange={(e) => {
                          setSpot({ ...spot, lat: e.target.value });
                        }}
                        placeholder="Latitude"
                        style={({
                          width: "90%",
                          backgroundColor: "lightgrey"
                        })}
                      />,
                    </label>
                    <label id='long-label'><p>Longitude</p>
                      <input type="text"
                        id="long-input"
                        name="long"
                        value={spot.long}
                        onChange={(e) => {
                          setSpot({ ...spot, long: e.target.value });
                        }}
                        placeholder="Longitude"
                        style={({
                          width: "95.4%",
                          backgroundColor: "lightgrey"
                        })}
                      />
                    </label>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

      )}
    </div>
  );
}

export default SpotDetail;
