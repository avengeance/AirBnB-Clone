// import React from 'react';
// import { FaStar } from 'react-icons/fa';

// function StarRating({ starCount, value, onStarClick }) {
//     const stars = [];
//     for (let i = 0; i < starCount; i++) {
//         const isFilled = i < value;
//         const star = (
//             <FaStar
//                 key={i}
//                 className={isFilled ? 'star filled' : 'star'}
//                 onClick={() => onStarClick(i + 1)}
//                 onMouseEnter={() => onStarHover(i + 1)}
//                 onMouseLeave={() => onStarHover(0)}
//             />
//         );
//         stars.push(star);
//     }
//     return <div className="star-rating">{stars}</div>;
// }

// export default StarRating;

import React from "react";

function StarRating({ starCount, value, onStarClick }) {
    const stars = []
    for (let i = 0; i < starCount; i++) {
        const isFilled = i < value
        stars.push(
            <i
                key={i}
                className={`fa${isFilled ? "s" : "r"} fa-star`}
                onClick={() => onStarClick(i + 1)}
            ></i>
        )
    }
    return <div className="star-rating">{stars}</div>
}

export default StarRating
