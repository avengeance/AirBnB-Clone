import { csrfFetch } from "./csrf";

const GET_REVIEWS = "reviews/all";
const ADD_REVIEW = "reviews/add";
const DELETE_REVIEW = 'reviews/delete'
const ADD_REVIEW_ERROR = 'ADD_REVIEW_ERROR';

const getReviews = (reviews) => ({
    type: GET_REVIEWS,
    payload: reviews,
})

const addReview = (review) => ({
    type: ADD_REVIEW,
    payload: review
})

const deleteReview = (review) => ({
    type: DELETE_REVIEW,
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
        if (data && data.errors) {
            return data
        }
        return data
    } else {
        const error = new Error(res.statusText)
        error.statusCode = res
        dispatch(addReviewError(error))
        throw error
    }
}

export const deleteReviewThunk = (reviewId) => async (dispatch) => {
    const res = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
    })
    const data = await res.json()
    dispatch(deleteReview(reviewId))
    return data
}

export const addReviewError = (error) => ({
    type: ADD_REVIEW_ERROR,
    payload: {
        error: error.message
    }
})

const instialState = {
    reviews: [],
    error: null
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
            newState.reviews = action.payload
            return {...newState}
        case DELETE_REVIEW:
            const newReviews = newState.reviews.filter((review) => review.id !== action.reviewId)
            return {
                ...newState,
                reviews: newReviews
            }
        case ADD_REVIEW_ERROR:
            return {
                ...newState,
                error: action.payload.error
            }
        default:
            return state;
    }
}

export default reviewsReducer
