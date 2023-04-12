import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import * as SpotActions from "../../store/spots";
import './CreateSpot.css';

function CreateSpot() {
    const { spotId } = useParams();

    const [spot, setSpot] = useState([])

    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [spotPreviewImage, setSpotPreviewImage] = useState('');
    const [spotImage, setSpotImage] = useState('');
    const [errors, setErrors] = useState([]);



    const dispatch = useDispatch();
    const history = useHistory();


    const handleSubmit = (e) => {
        e.preventDefault();
        // setErrors([]);
        const payload = {
            country,
            address,
            city,
            state,
            lat,
            lng,
            description,
            title,
            price,
            // spotImage,
            spotPreviewImage,
        }
        return dispatch(SpotActions.createSpotThunk(payload)).then((spot) => { history.push(`/spots/${spot.id}`) }).catch(
            async (res) => {
                const data = await res.json();
                if (data.errors) {
                    setErrors(data.errors);
                }
            }
        )
    }

    return (
        <div id="spot-box">
            <div className="create-spot-form">
                <h2 id="create-text">Create a new Spot</h2>
                <h3 id="question-text">Where's your place located?</h3>
                <p id="description">Guests will only get your exact address once they booked a reservation.</p>
                <div>
                    <form className="form" onSubmit={handleSubmit}>
                        <div id="form-location" className="form-div">
                            <label id="country-label"><p>Country</p>
                                <input type="text"
                                    id="country-input"
                                    name="country"
                                    value={spot.country}
                                    onChange={(e) => {
                                        setCountry(e.target.value);
                                    }}
                                    placeholder="Country"
                                    style={({
                                        width: "98%",
                                        backgroundColor: "lightgrey"
                                    })}
                                    required
                                />
                                {spot.country === '' && (
                                    <span style={{
                                        color: "red",
                                    }}>
                                        Country is required
                                    </span>
                                )}
                            </label>
                            <label id='street-label'><p>Street Address</p>
                                <input type="text"
                                    id="street-input"
                                    name="street"
                                    value={spot.address}
                                    onChange={(e) => {
                                        setAddress(e.target.value);
                                    }}
                                    placeholder="Address"
                                    style={({
                                        width: "98%",
                                        backgroundColor: "lightgrey"
                                    })}
                                    required
                                />
                                {spot.address === '' && (
                                    <span style={{
                                        color: "red",
                                    }}>
                                        Address is required
                                    </span>
                                )}
                            </label>
                            <div id="city-state-label">
                                <label id='city-label'><p>City</p>
                                    <input type="text"
                                        id="city-input"
                                        name="city"
                                        value={spot.city}
                                        onChange={(e) => {
                                            setCity(e.target.value);
                                        }}
                                        placeholder="City"
                                        style={{
                                            width: "90%",
                                            backgroundColor: "lightgrey"
                                        }}
                                        required
                                    />,
                                    {spot.city === '' && (
                                        <span style={{
                                            color: "red",
                                        }}>
                                            City is required
                                        </span>
                                    )}
                                </label>
                                <label id='state-label'><p>State</p>
                                    <input type="text"
                                        id="state-input"
                                        name="state"
                                        value={spot.state}
                                        onChange={(e) => {
                                            setState(e.target.value);
                                        }}
                                        placeholder="STATE"
                                        style={({
                                            width: "94%",
                                            backgroundColor: "lightgrey"
                                        })}
                                        required
                                    />
                                    {spot.state === '' && (
                                        <span style={{
                                            color: "red",
                                        }}>
                                            State is required
                                        </span>
                                    )}
                                </label>
                            </div>
                            <div id="lat-long-label">
                                <label id='lat-label'><p>Latitude</p>
                                    <input type="text"
                                        id="lat-input"
                                        name="lat"
                                        value={spot.lat}
                                        onChange={(e) => {
                                            setLat(e.target.value);
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
                                            setLng(e.target.value);
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
                        <div id="form-description" className="form-div">
                            <label id="description-label">
                                <h3>Describe your place to guests</h3>
                                <p>
                                    Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.
                                </p>
                                <input
                                    type="text"
                                    id="description-input"
                                    name="description"
                                    value={spot?.description}
                                    onChange={(e) => {
                                        setDescription(e.target.value);
                                    }}
                                    placeholder="Please write at least 30 characters"
                                    style={({
                                        width: "98%",
                                        height: "100px",
                                        backgroundColor: "lightgrey",
                                    })}
                                    required
                                />
                                {spot.description?.length < 30 && (
                                    <span style={{
                                        color: "red",
                                    }}>
                                        Description must be at least 30 characters
                                    </span>
                                )}
                            </label>
                        </div>
                        <div id="form-title" className="form-div">
                            <label
                                id="title-label">
                                <h3>Create a title for your spot</h3>
                                <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
                                <input
                                    type="text"
                                    id="title-input"
                                    name="title"
                                    value={spot.title}
                                    onChange={(e) => {
                                        setTitle(e.target.value);
                                    }}
                                    placeholder="Name of your spot"
                                    style={({
                                        width: "98%",
                                        backgroundColor: "lightgrey"
                                    })}
                                    required
                                />
                                {spot.title === '' && (
                                    <span style={{
                                        color: "red",
                                    }}>
                                        Name is required
                                    </span>
                                )}
                            </label>
                        </div>
                        <div id="form-price" className="form-div">
                            <label id="price-label">
                                <h3>Set a base price for your spot</h3>
                                <p>
                                    Competitive pricing can help your listing stand out and rank higher in search results.
                                </p>
                                <input
                                    type="text"
                                    id="price-input"
                                    name="price"
                                    value={spot.price}
                                    onChange={(e) => {
                                        setPrice(e.target.value);
                                    }}
                                    placeholder="Price per night (USD)"
                                    style={({
                                        width: "98%",
                                        backgroundColor: "lightgrey"
                                    })}
                                    required
                                />
                                {spot.price === '' && (
                                    <span style={{
                                        color: "red",
                                    }}>
                                        Price is required
                                    </span>
                                )}
                            </label>
                        </div>
                        <div id="form-image" className="form-div">
                            <label id="image-label">
                                <h3>Liven up your spot with photos</h3>
                                <p>
                                    Submit a link to at least one photo to publish your spot.
                                </p>
                                <input
                                    type="text"
                                    className="image-input"
                                    name="image"
                                    onChange={(e) => {
                                        // const file = e.target.files && e.target.files?.[0];
                                        // console.log('This is file',file)
                                        // if (file && (file.name.endsWith(".jpg") || file.name.endsWith(".png") || file.name.endsWith(".jpeg"))) {
                                        //     setSpotImage(file);
                                        // }
                                        setSpotImage(e.target.value);
                                    }}
                                    style={({
                                        width: "98%",
                                        backgroundColor: "lightgrey",
                                    })}
                                    placeholder="Preview Image URL"
                                    required
                                />
                                {spot.image === '' && (
                                    <span style={{
                                        color: 'red'
                                    }}>
                                        Preview image is required
                                    </span>
                                )}
                                <input
                                    type="text"
                                    className="image-input"
                                    name="image"
                                    onChange={(e) => {
                                        setSpotImage(e.target.files[0]);
                                    }}
                                    style={({
                                        width: "98%",
                                        backgroundColor: "lightgrey"
                                    })}
                                    placeholder="Image URL"
                                />
                                <input
                                    type="text"
                                    className="image-input"
                                    name="image"
                                    onChange={(e) => {
                                        setSpotImage(e.target.files[0]);
                                    }}
                                    style={({
                                        width: "98%",
                                        backgroundColor: "lightgrey"
                                    })}
                                    placeholder="Image URL"
                                />
                                <input
                                    type="text"
                                    className="image-input"
                                    name="image"
                                    onChange={(e) => {
                                        setSpotImage(e.target.files[0]);
                                    }}
                                    style={({
                                        width: "98%",
                                        backgroundColor: "lightgrey"
                                    })}
                                    placeholder="Image URL"
                                />
                                <input
                                    type="text"
                                    className="image-input"
                                    name="image"
                                    onChange={(e) => {
                                        setSpotImage(e.target.files[0]);
                                    }}
                                    style={({
                                        width: "98%",
                                        backgroundColor: "lightgrey"
                                    })}
                                    placeholder="Image URL"
                                />
                            </label>
                        </div>
                        <div id="form-submit-button">
                            <button
                                type="submit"
                                className="submit-button">
                                Create a Spot
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}


export default CreateSpot
