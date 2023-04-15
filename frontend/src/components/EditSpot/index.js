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
    const [reviews, setReviews] = useState([]);
    const [spot, setSpot] = useState('');
    const user = useSelector(state => state.session.user);
    const history = useHistory();
    const currentSpot = useSelector((state) => state.spots.currentSpot)

    console.log('this is current spot:', currentSpot)

    const [country, setCountry] = useState(currentSpot.country);
    const [address, setAddress] = useState(currentSpot.address);
    const [city, setCity] = useState(currentSpot.city);
    const [state, setState] = useState(currentSpot.state);
    const [lat, setLat] = useState(currentSpot.lat);
    const [lng, setLng] = useState(currentSpot.lng);
    const [description, setDescription] = useState(currentSpot.description);
    const [title, setTitle] = useState(currentSpot.title);
    const [price, setPrice] = useState(currentSpot.price);
    const [spotPreviewImage, setSpotPreviewImage] = useState('');
    const [preview, setPreview] = useState('');
    const [spotImage, setSpotImage] = useState('');
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
        dispatch(spotActions.getCurrentSpotThunk(spotId));
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
