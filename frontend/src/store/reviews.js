import { csrfFetch } from "./csrf";

const GET_REVIEWS = "reviews/all";

const getReviews = (reviews) => ({
    type: GET_REVIEWS,
    payload: reviews,
})

export const getReviewsThunk = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/${spotId}/reviews`, {
        method: 'GET',
    });
    const data = await res.json();
    dispatch(getReviews(data));
    return data
}

