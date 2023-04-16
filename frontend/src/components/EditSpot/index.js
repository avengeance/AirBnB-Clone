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
        <div className="edit-spot">
            <h2>Edit Spot</h2>
            <form className="spot-form" onSubmit={handleSubmit}>
                <div className="form-group-1">
                    <label>Country<p className="errors">{errors.country}</p></label>
                    <input
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        type="text"
                        className="form-control"
                        placeholder="Country"
                    />
                    <br />
                    <label>Address<p className="errors">{errors.address}</p></label>
                    <input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        type="text"
                        className="form-control"
                        placeholder="Address"
                    />
                    <br />
                    <label>City<p className="errors">{errors.city}</p></label>
                    <input
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        type="text"
                        className="form-control"
                        placeholder="City"
                    />
                    <br />
                    <label>State<p className="errors">{errors.state}</p></label>
                    <input
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        type="text"
                        className="form-control"
                        placeholder="State"
                    />
                    <br />
                    <label>Latitude<p className="errors">{errors.lat}</p></label>
                    <input
                        value={lat}
                        onChange={(e) => setLat(e.target.value)}
                        type="text"
                        className="form-control"
                        placeholder="Latitude"
                    />
                    <br />
                    <label>Longitude<p className="errors">{errors.lng}</p></label>
                    <input
                        value={lng}
                        onChange={(e) => setLng(e.target.value)}
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
                        onChange={(e) => setDescription(e.target.value)}
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
                        onChange={(e) => (setTitle(e.target.value))}
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
                        onChange={(e) => setPrice(e.target.value)}
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
