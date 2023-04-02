import { csrfFetch } from "./csrf";

const GET_SPOTS = 'spots/all';
const CREATE_SPOT = 'spots/create';

const getSpots = (spots) => ({
    type: GET_SPOTS,
    payload: spots,
})

const createSpot = (spot) => ({
    type: CREATE_SPOT,
    payload: spot
})

export const getSpotsThunk = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots', {
        method: 'GET',
    });
    const data = await res.json();
    dispatch(getSpots(data));
    return res
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

const initialState = { spots: [] }

const spotReducer = (state = initialState, action) => {
    let newState = { ...state }
    switch (action.type) {
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
        default:
            return state;
    }
}

export default spotReducer
