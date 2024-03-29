import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import * as SpotActions from "../../store/spots";
import "./CreateSpot.css";

function CreateSpot() {
  const [spot, setSpot] = useState([]);

  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  const [spotPreviewImage, setSpotPreviewImage] = useState("");
  const [firstImage, setFirstImage] = useState("");
  const [secondImage, setSecondImage] = useState("");
  const [thirdImage, setThirdImage] = useState("");
  const [fourthImage, setFourthImage] = useState("");

  const [errors, setErrors] = useState([]);

  const dispatch = useDispatch();
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const imageErrors = {};

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
      spotPreviewImage,
      firstImage,
      secondImage,
      thirdImage,
      fourthImage,
    };

    const images = [
      spotPreviewImage,
      firstImage,
      secondImage,
      thirdImage,
      fourthImage,
    ];

    const newSpotImages = images.map((img, idx) => ({
      url: img,
      preview: idx === 0,
    }));

    let newSpot;

    try {
      const spot = await dispatch(
        SpotActions.createSpotThunk(payload, newSpotImages)
      );
      const newSpotId = spot.id;
      const url = `/spots/${newSpotId}`;
      if (spot) {
        newSpot = spot;
        setCountry("");
        setAddress("");
        setCity("");
        setState("");
        setDescription("");
        setTitle("");
        setPrice("");
        setSpotPreviewImage("");
        setFirstImage("");
        setSecondImage("");
        setThirdImage("");
        setFourthImage("");
        setErrors([]);
        history.push(url);
      }
    } catch (res) {
      const data = await res.json();

      if (!spotPreviewImage) {
        imageErrors.spotPreviewImage = "Preview Image is required";
      }

      if (!/\.(png|jpe?g)$/i.test(firstImage)) {
        imageErrors.imageUrl = "Image URL must end in .png, .jpg or .jpeg";
      }

      if (data && data.errors) {
        const totalErrors = { ...data.errors, ...imageErrors };
        setErrors(totalErrors);
      }
    }
    {
    }
  };

  return (
    <div id="spot-box">
      <div className="create-spot-form">
        <h2 id="create-text">Create a new Spot</h2>
        <h3 id="question-text">Where's your place located?</h3>
        <p id="description">
          Guests will only get your exact address once they booked a
          reservation.
        </p>
        <div>
          <form className="form" onSubmit={handleSubmit}>
            <div id="form-location" className="form-div">
              <label id="country-label">
                Country<p className="errors">{errors.country}</p>
                <input
                  type="text"
                  id="country-input"
                  name="country"
                  value={spot.country}
                  onChange={(e) => {
                    setCountry(e.target.value);
                  }}
                  placeholder="Country"
                  style={{
                    width: "98%",
                    backgroundColor: "lightgrey",
                  }}
                />
              </label>
              <label id="street-label">
                Street Address<p className="errors">{errors.address}</p>
                <input
                  type="text"
                  id="street-input"
                  name="street"
                  value={spot.address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                  }}
                  placeholder="Address"
                  style={{
                    width: "98%",
                    backgroundColor: "lightgrey",
                  }}
                />
              </label>
              <div id="city-state-label">
                <label id="city-label">
                  City<p className="errors">{errors.city}</p>
                  <input
                    type="text"
                    id="city-input"
                    name="city"
                    value={spot.city}
                    onChange={(e) => {
                      setCity(e.target.value);
                    }}
                    placeholder="City"
                    style={{
                      width: "90%",
                      backgroundColor: "lightgrey",
                    }}
                  />
                  ,
                </label>
                <label id="state-label">
                  State<p className="errors">{errors.state}</p>
                  <input
                    type="text"
                    id="state-input"
                    name="state"
                    value={spot.state}
                    onChange={(e) => {
                      setState(e.target.value);
                    }}
                    placeholder="STATE"
                    style={{
                      width: "94%",
                      backgroundColor: "lightgrey",
                    }}
                  />
                </label>
              </div>
              <div id="lat-long-label">
                <label id="lat-label">
                  Latitude<p className="errors">{errors.lat}</p>
                  <input
                    type="text"
                    id="lat-input"
                    name="lat"
                    value={spot.lat}
                    onChange={(e) => {
                      setLat(e.target.value);
                    }}
                    placeholder="Latitude"
                    style={{
                      width: "90%",
                      backgroundColor: "lightgrey",
                    }}
                  />
                  ,
                </label>
                <label id="long-label">
                  Longitude<p className="errors">{errors.lng}</p>
                  <input
                    type="text"
                    id="long-input"
                    name="long"
                    value={spot.lng}
                    onChange={(e) => {
                      setLng(e.target.value);
                    }}
                    placeholder="Longitude"
                    style={{
                      width: "95.4%",
                      backgroundColor: "lightgrey",
                    }}
                  />
                </label>
              </div>
            </div>
            <div id="form-description" className="form-div">
              <label id="description-label">
                <h3>Describe your place to guests</h3>
                <h4>
                  Mention the best features of your space, any special
                  amentities like fast wifi or parking, and what you love about
                  the neighborhood.
                </h4>
                <textarea
                  id="description-input"
                  name="description"
                  value={spot?.description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                  placeholder="Please write at least 30 characters"
                  rows="10"
                  style={{
                    width: "98%",
                    backgroundColor: "lightgrey",
                  }}
                />
                <p className="errors">{errors.description}</p>
              </label>
            </div>
            <div id="form-title" className="form-div">
              <label id="title-label">
                <h3>Create a title for your spot</h3>
                <h4>
                  Catch guests' attention with a spot title that highlights what
                  makes your place special.
                </h4>
                <input
                  type="text"
                  id="title-input"
                  name="title"
                  value={spot.title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                  placeholder="Name of your spot"
                  style={{
                    width: "98%",
                    backgroundColor: "lightgrey",
                  }}
                />
                <p className="errors">{errors.title}</p>
              </label>
            </div>
            <div id="form-price" className="form-div">
              <label id="price-label">
                <h3>Set a base price for your spot</h3>
                <h4>
                  Competitive pricing can help your listing stand out and rank
                  higher in search results.
                </h4>
                <input
                  type="text"
                  id="price-input"
                  name="price"
                  value={spot.price}
                  onChange={(e) => {
                    setPrice(e.target.value);
                  }}
                  placeholder="$ Price per night (USD)"
                  style={{
                    width: "98%",
                    backgroundColor: "lightgrey",
                  }}
                />
                <p className="errors">{errors.price}</p>
              </label>
            </div>
            <div id="form-image" className="form-div">
              <label id="image-label">
                <h3>Liven up your spot with photos</h3>
                <p>Submit a link to at least one photo to publish your spot.</p>
                <input
                  type="text"
                  className="image-input"
                  value={spotPreviewImage}
                  name="image"
                  onChange={(e) => {
                    setSpotPreviewImage(e.target.value);
                  }}
                  style={{
                    width: "98%",
                    backgroundColor: "lightgrey",
                  }}
                  placeholder="Preview Image URL"
                  required
                />
                <p className="errors">{errors.image}</p>
                <input
                  type="text"
                  className="image-input"
                  name="image"
                  value={firstImage}
                  onChange={(e) => {
                    setFirstImage(e.target.value);
                  }}
                  style={{
                    width: "98%",
                    backgroundColor: "lightgrey",
                  }}
                  placeholder="Image URL"
                  required
                />
                <input
                  type="text"
                  className="image-input"
                  name="image"
                  value={secondImage}
                  onChange={(e) => {
                    setSecondImage(e.target.value);
                  }}
                  style={{
                    width: "98%",
                    backgroundColor: "lightgrey",
                  }}
                  placeholder="Image URL"
                  required
                />
                <input
                  type="text"
                  className="image-input"
                  name="image"
                  value={thirdImage}
                  onChange={(e) => {
                    setThirdImage(e.target.value);
                  }}
                  style={{
                    width: "98%",
                    backgroundColor: "lightgrey",
                  }}
                  placeholder="Image URL"
                  required
                />
                <input
                  type="text"
                  className="image-input"
                  name="image"
                  value={fourthImage}
                  onChange={(e) => {
                    setFourthImage(e.target.value);
                  }}
                  style={{
                    width: "98%",
                    backgroundColor: "lightgrey",
                  }}
                  placeholder="Image URL"
                  required
                />
              </label>
            </div>
            <div id="form-submit-button">
              <button
                type="submit"
                className="submit-button"
                onClick={handleSubmit}
              >
                Create Spot
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateSpot;
