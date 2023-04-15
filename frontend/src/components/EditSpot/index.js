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
    const [currentSpot, setCurrentSpot] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [spot, setSpot] = useState(null);
    const user = useSelector(state => state.session.user);
    const history = useHistory();

    const [country, setCountry] = useState(spot.country);
    const [address, setAddress] = useState(spot.address);
    const [city, setCity] = useState(spot.city);
    const [state, setState] = useState(spot.state);
    const [lat, setLat] = useState(spot.lat);
    const [lng, setLng] = useState(spot.lng);
    const [description, setDescription] = useState(spot.description);
    const [title, setTitle] = useState(spot.title);
    const [price, setPrice] = useState(spot.price);
    const [spotPreviewImage, setSpotPreviewImage] = useState(spot.spotPreviewImage);
    const [preview, setPreview] = useState(false);
    const [spotImage, setSpotImage] = useState(spot.spotImage);
    const [errors, setErrors] = useState({});

    const updateCountry = (e) => { setCountry(e.target.value) };
    const updateAddress = (e) => { setAddress(e.target.value) };
    const updateCity = (e) => { setCity(e.target.value) };
    const updateState = (e) => { setState(e.target.value) };
    const updateLat = (e) => { setLat(e.target.value) };
    const updateLng = (e) => { setLng(e.target.value) };
    const updateDescription = (e) => { setDescription(e.target.value) };
    const updateTitle = (e) => { setTitle(e.target.value) };
    const updatePrice = (e) => { setPrice(e.target.value) };
    const updateSpotPreviewImage = (e) => { setSpotPreviewImage(e.target.value) };
    const updateSpotImage = (e) => { setSpotImage(e.target.value) };
    const updatePreview = (e) => { setPreview(e.target.value) };

    useEffect(() => {
        dispatch(spotActions.getUserSpotsThunk(spotId));
    }, [dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...spot,
            country,
            address,
            city,
            state,
            lat,
            lng,
            description,
            title,
            price,
            spotPreviewImage,
            preview,
            spotImage,
        }
        await dispatch(spotActions.editSpotThunk(payload, spotId)).then((spot) => {
            history.push(`/spots/${spot.id}/edit`)
        });
    }

    return (
        <div className="edit-spot">
            <h2>Edit Spot</h2>
            <form className="spot-form" onSubmit={handleSubmit}>
                <div className="form-group-1">
                    <label>Country<p className="errors">{errors.country}</p></label>
                    <input
                        value={country}
                        onChange={updateCountry}
                        type="text"
                        className="form-control"
                        placeholder="Country"
                    />
                    <br />
                    <label>Address<p className="errors">{errors.address}</p></label>
                    <input
                        value={address}
                        onChange={updateAddress}
                        type="text"
                        className="form-control"
                        placeholder="Address"
                    />
                    <br />
                    <label>City<p className="errors">{errors.city}</p></label>
                    <input
                        value={city}
                        onChange={updateCity}
                        type="text"
                        className="form-control"
                        placeholder="City"
                    />
                    <br />
                    <label>State<p className="errors">{errors.state}</p></label>
                    <input
                        value={state}
                        onChange={updateState}
                        type="text"
                        className="form-control"
                        placeholder="State"
                    />
                    <br />
                    <label>Latitude<p className="errors">{errors.lat}</p></label>
                    <input
                        value={lat}
                        onChange={updateLat}
                        type="text"
                        className="form-control"
                        placeholder="Latitude"
                    />
                    <br />
                    <label>Longitude<p className="errors">{errors.lng}</p></label>
                    <input
                        value={lng}
                        onChange={updateLng}
                        type="text"
                        className="form-control"
                        placeholder="Longitude"
                    />
                    <br />

                </div>
                <div className="form-group-2">
                    <h3>Describe your place to guests</h3>
                    <h4>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</h4>
                    <textarea
                        value={description}
                        onChange={updateDescription}
                        className="form-control"
                        placeholder="Please write at least 30 characters"
                    />
                    <p className="errors">{errors.description}</p>
                    <br />
                </div>
                <div className="form-group-3">
                    <h3>Create a title for your spot</h3>
                    <h4>Catch guests attention with a spot title that highlights what makes your place special.</h4>
                    <input
                        value={title}
                        onChange={updateTitle}
                        type="text"
                        placeholder="Name of your spot"
                    />
                    <p className="errors">{errors.title}</p>
                    <br />
                </div>
                <div className="form-group-4">
                    <h3>Set a base price for your Spot</h3>
                    <h4>Competitive pricing can help your listing stand out and rank higher in search results.</h4>
                    $<input
                        value={price}
                        onChange={updatePrice}
                        type="text"
                        placeholder="Price per night (USD)"
                    />
                    <p className="errors">{errors.price}</p>
                    <br />
                </div>
                <button type="submit" className="submit-button" onClick={handleSubmit}>Submit</button>
            </form>
        </div>
    )
}

export default EditSpot
