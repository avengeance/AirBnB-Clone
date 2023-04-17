import React, { useState } from "react";

function StarRating({ rating, onRatingChange }) {
    const [hoveredStar, setHoveredStar] = useState(0);
    const stars = [1, 2, 3, 4, 5];
    const [errors, setErrors] = useState([]);

    const handleStarHover = (e) => {
        const starValue = parseInt(e.target.value)
        setHoveredStar(starValue);
    };

    const handleMouseLeave = () => {
        setHoveredStar(0);
    };

    return (
        <div className="star-rating">
            {stars.map((star) => (
                <label key={star}>
                    <input
                        type="radio"
                        name="rating"
                        value={star}
                        onMouseMove={handleStarHover}
                        onMouseLeave={handleMouseLeave}
                        checked={rating === star}
                        onClick={(e) => {
                            onRatingChange(e.target.value)
                        }}
                    /><p className="errors">{errors.star}</p>
                    <i
                        className={`fas fa-star ${(hoveredStar || rating) <= star ? "active" : ""}`}

                    ></i>

                </label>
            ))}Stars
        </div>
    );
}

export default StarRating;
