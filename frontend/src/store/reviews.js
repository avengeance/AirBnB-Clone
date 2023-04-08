import { csrfFetch } from "./csrf";

const GET_REVIEWS = "reviews/all";
const ADD_REVIEW = "reviews/add";

const getReviews = (reviews) => ({
    type: GET_REVIEWS,
    payload: reviews,
})

const addReview = (review) => ({
    type: "ADD_REVIEW",
    payload: review
})

export const getReviewsThunk = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/${spotId}/reviews`, {
        method: 'GET',
    });
    const data = await res.json();
    dispatch(getReviews(data));
    return data
}

export const addReviewThunk = (review) => async (dispatch) => {
    const res = await csrfFetch(`/api/reviews`, {
        method: 'POST',
        body: JSON.stringify(review),
    });
    const data = await res.json();
    dispatch(addReview(data));
}
