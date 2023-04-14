import { csrfFetch } from "./csrf";

const GET_REVIEWS = "reviews/all";
const ADD_REVIEW = "reviews/add";

const getReviews = (reviews) => ({
    type: GET_REVIEWS,
    payload: reviews,
})

const addReview = (review) => ({
    type: ADD_REVIEW,
    payload: review
})

export const getReviewsThunk = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'GET',
    });
    const data = await res.json();
    dispatch(getReviews(data));
    return data
}

export const addReviewThunk = (review, spotId, stars) => async (dispatch) => {
    stars = Number(stars)
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ review, stars }),
    });
    if (res.ok) {
        const data = await res.json();
        dispatch(addReview(data));
        return data
    }
}

const instialState = {
    reviews: [],
}

const reviewsReducer = (state = instialState, action) => {
    let newState = { ...state }
    switch (action.type) {
        case GET_REVIEWS:
            return {
                ...newState,
                reviews: action.payload
            }
        case ADD_REVIEW:
            newState.reviews[action.payload.id] = action.payload
            return newState
        default:
            return state;
    }
}

export default reviewsReducer
