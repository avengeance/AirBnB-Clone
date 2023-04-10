import React, { useState } from "react";

function StarRating({ starCount, value, onStarClick }) {
    const [hoveredStars, setHoveredStars] = useState(0);

    const stars = [];
    for (let i = 0; i < starCount; i++) {
        const isFilled = i < hoveredStars || i < value;
        stars.push(
            <i
                key={i}
                className={`fa${isFilled ? "s" : "r"} fa-star`}
                onClick={() => onStarClick(i + 1)}
                onMouseEnter={() => setHoveredStars(i + 1)}
            ></i>
        );
    }

    return (
        <div
            className="star-rating"
            onMouseLeave={() => setHoveredStars(0)}
        >
            {stars}
        </div>
    );
}

export default StarRating;
