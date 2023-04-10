import { csrfFetch } from "./csrf";

const GET_CURRENT_SPOT = 'spots/get'
const GET_SPOTS = 'spots/all';
const CREATE_SPOT = 'spots/create';
const GET_REVIEWS = 'reviews/all';
const USER_SPOTS = 'spots/user';

const getCurrentSpot = (spot) => ({
    type: GET_CURRENT_SPOT,
    payload: spot
})

const getSpots = (spots) => ({
    type: GET_SPOTS,
    payload: spots,
})

const createSpot = (spot) => ({
    type: CREATE_SPOT,
    payload: spot
})


const userSpots = (spots) => ({
    type: USER_SPOTS,
    payload: spots
})

export const getSpotsThunk = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots', {
        method: 'GET',
    });
    const data = await res.json();
    dispatch(getSpots(data));
    return data
}

export const getCurrentSpotThunk = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'GET',
    });
    const data = await res.json();
    dispatch(getCurrentSpot(data));
    return data
}

export const createSpotThunk = (
    country,
    address,
    city,
    state,
    lat,
    lng,
    description,
    title,
    price,
    spotPreviewImage
) => async (dispatch) => {
    const res = await csrfFetch('/api/spots', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
                country,
                address,
                city,
                state,
                lat,
                lng,
                description,
                title,
                price,
                spotPreviewImage
            }
        ),
    });
    const data = await res.json();
    dispatch(createSpot(data));
    return res
}


export const getUserSpotsThunk = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots/current', {
        method: 'GET',
    });
    const data = await res.json();
    dispatch(userSpots(data));
    return data
}

const initialState = { spots: [] }

const spotReducer = (state = initialState, action) => {
    let newState = { ...state }
    switch (action.type) {
        case GET_CURRENT_SPOT:
            return {
                ...newState,
                currentSpot: action.payload
            }
        case GET_SPOTS:
            return {
                ...newState,
                spots: action.payload
            }
        case CREATE_SPOT:
            return {
                ...newState,
                spots: [...state.spots, action.payload]
            }
        case USER_SPOTS:
            return {
                ...newState,
                spots: action.payload
            }
        default:
            return state;
    }
}

export default spotReducer
