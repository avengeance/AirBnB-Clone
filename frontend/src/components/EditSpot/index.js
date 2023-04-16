import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserSpotsThunk, editSpotThunk } from "../../store/spots";
import { useParams, useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import * as spotActions from "../../store/spots";
import './EditSpot.css';

const EditSpot = () => {
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const history = useHistory();

    const user = useSelector(state => state.session.user);

    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [errors, setErrors] = useState({});

    const currSpot = useSelector((state) => state.spots.currentSpot)

    useEffect(() => {
        dispatch(spotActions.getCurrentSpotThunk(spotId));

    }, [dispatch, spotId]);

    useEffect(() => {
        if (currSpot) {
            setCountry(currSpot.country)
            setAddress(currSpot?.address || '')
            setCity(currSpot?.city || '')
            setState(currSpot?.state || '')
            setLat(currSpot?.lat || '')
            setLng(currSpot?.lng || '')
            setDescription(currSpot?.description || '')
            setTitle(currSpot?.title || '')
            setPrice(currSpot?.price || '')
        }

    }, [currSpot])

    const handleSubmit = async (e) => {
        e.preventDefault();
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
        }
        const data = await dispatch(spotActions.editSpotThunk(payload, spotId))
        console.log('useEffect dispatch:', data)
        if (data) {
            history.push(`/spots/${spotId}`)

        }
    }
    return (
        <div id="spot-box">
            <div className="create-spot-form">
                <h2 id="create-text">Edit Spot</h2>
                <div>
                    <form className="form" onSubmit={handleSubmit}>
                        <div id="form-location" className="form-div">
                            <label id="country-label">Country<p className="errors">{errors.country}</p>
                                <input type="text"
                                    id="country-input"
                                    name="country"
                                    value={country}
                                    onChange={(e) => {
                                        setCountry(e.target.value);
                                    }}
                                    placeholder="Country"
                                    style={({
                                        width: "98%",
                                        backgroundColor: "lightgrey"
                                    })}
                                />
                            </label>
                            <label id='street-label'>Street Address<p className="errors">{errors.address}</p>
                                <input type="text"
                                    id="street-input"
                                    name="street"
                                    value={address}
                                    onChange={(e) => {
                                        setAddress(e.target.value);
                                    }}
                                    placeholder="Address"
                                    style={({
                                        width: "98%",
                                        backgroundColor: "lightgrey"
                                    })}
                                />
                            </label>
                            <div id="city-state-label">
                                <label id='city-label'>City<p className="errors">{errors.city}</p>
                                    <input type="text"
                                        id="city-input"
                                        name="city"
                                        value={city}
                                        onChange={(e) => {
                                            setCity(e.target.value);
                                        }}
                                        placeholder="City"
                                        style={{
                                            width: "90%",
                                            backgroundColor: "lightgrey"
                                        }}
                                    />,
                                </label>
                                <label id='state-label'>State<p className="errors">{errors.state}</p>
                                    <input type="text"
                                        id="state-input"
                                        name="state"
                                        value={state}
                                        onChange={(e) => {
                                            setState(e.target.value);
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
                                <label id='lat-label'>Latitude<p className="errors">{errors.lat}</p>
                                    <input type="text"
                                        id="lat-input"
                                        name="lat"
                                        value={lat}
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
                                <label id='long-label'>Longitude<p className="errors">{errors.lng}</p>
                                    <input type="text"
                                        id="long-input"
                                        name="lng"
                                        value={lng}
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
                                <h4>
                                    Catch guests attention with a spot title that highlights what makes your place special.
                                </h4>
                                <textarea
                                    id="description-input"
                                    name="description"
                                    value={description}
                                    onChange={(e) => {
                                        setDescription(e.target.value);
                                    }}
                                    placeholder="Please write at least 30 characters"
                                    rows='10'
                                    style={({
                                        width: "98%",
                                        backgroundColor: "lightgrey",
                                    })}
                                />
                                <p className="errors">{errors.description}</p>
                            </label>
                        </div>
                        <div id="form-title" className="form-div">
                            <label
                                id="title-label">
                                <h3>Create a title for your spot</h3>
                                <h4>Catch guests' attention with a spot title that highlights what makes your place special.</h4>
                                <input
                                    type="text"
                                    id="title-input"
                                    name="title"
                                    value={title}
                                    onChange={(e) => {
                                        setTitle(e.target.value);
                                    }}
                                    placeholder="Name of your spot"
                                    style={({
                                        width: "98%",
                                        backgroundColor: "lightgrey"
                                    })}
                                />
                                <p className="errors">{errors.title}</p>
                            </label>
                        </div>
                        <div id="form-price" className="form-div">
                            <label id="price-label">
                                <h3>Set a base price for your spot</h3>
                                <h4>
                                    Competitive pricing can help your listing stand out and rank higher in search results.
                                </h4>
                                <input
                                    type="text"
                                    id="price-input"
                                    name="price"
                                    value={price}
                                    onChange={(e) => {
                                        setPrice(e.target.value);
                                    }}
                                    placeholder="$ Price per night (USD)"
                                    style={({
                                        width: "98%",
                                        backgroundColor: "lightgrey"
                                    })}
                                />
                                <p className="errors">{errors.price}</p>
                            </label>
                        </div>
                        <div id="form-submit-button">
                            <button type="submit" className="submit-button" onClick={handleSubmit}>Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditSpot
