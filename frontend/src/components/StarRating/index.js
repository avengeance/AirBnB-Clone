import React, { useState } from "react";

function StarRating({ rating, onRatingChange }) {
    const [hoveredStar, setHoveredStar] = useState(0);
    const stars = [1, 2, 3, 4, 5];

    const handleStarHover = (e) => {
        setHoveredStar(Number(e.target.value));
    };

    const handleMouseLeave = () => {
        setHoveredStar(0);
    };

    return (
        <div className="star-rating">
            {stars.map((star) => (
                <label key={star}>
                    <input
                        type="range"
                        name="rating"
                        // min="1"
                        // max="5"
                        value={star}
                        onMouseMove={handleStarHover}
                        onMouseLeave={handleMouseLeave}
                        checked={rating === star}
                        onClick={(e) => {
                            console.log(e.target.value)
                            onRatingChange(e.target.value)
                        }}
                    />
                    <i
                        className={`fas fa-star ${(hoveredStar || rating) >= star ? "active" : ""
                            }`}
                    ></i>
                </label>
            ))}
        </div>
    );
}

export default StarRating;
