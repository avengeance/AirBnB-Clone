import { csrfFetch } from "./csrf";

const GET_CURRENT_SPOT = 'spots/get'
const GET_SPOTS = 'spots/all';
const CREATE_SPOT = 'spots/create';
const USER_SPOTS = 'spots/user';
const EDIT_SPOT = 'spots/edit';
const DELETE_SPOT = 'spots/delete';

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

const editSpot = (spot) => ({
    type: EDIT_SPOT,
    payload: spot
})

const deleteSpot = (spot) => ({
    type: DELETE_SPOT,
    payload: spot
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

export const createSpotThunk = (spot, images) => async (dispatch) => {
    // const { country, address, city, state, lat, lng, description, id, title, price, spotPreviewImage } = spot
    const res = await csrfFetch('/api/spots', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(spot),
    });
    if (res.ok) {
        const data = await res.json();

        const imgRes = await Promise.all(
            images.map((img) =>
                csrfFetch(`/api/spots/${data.id}/images`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(img),
                })
            )
        )

        const imgUrl = await Promise.all(
            imgRes.map(async (res) => {
                if (res.ok) {
                    const data = await res.json();
                    return data.url
                }
            })
        )

        data.images = imgUrl.filter((url) => url !== null)

        await dispatch(createSpot(data));
        return data
    }
}


export const getUserSpotsThunk = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots/current', {
        method: 'GET',
    });
    if (res.ok) {
        const data = await res.json();
        dispatch(userSpots(data));
        return data
    }
}

export const editSpotThunk = (spot, spotId) => async (dispatch) => {
    const { country, address, city, state, lat, lng, description, title, price } = spot;
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'PUT',
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
            }
        ),
    });
    if (res.ok) {
        const data = await res.json();
        dispatch(editSpot(data));
        return data
    }
}


export const deleteSpotThunk = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: "DELETE"
    })
    const data = await response.json();
    dispatch(deleteSpot(spotId))
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
            // newState.spots[action.spotId] = action.spot
            newState.data = action.data
            return {
                ...newState,
            }
        case USER_SPOTS:
            return {
                ...newState,
                spots: action.payload
            }
        case EDIT_SPOT:
            return {
                ...newState,
                spots: action.payload
            }
        case DELETE_SPOT:
            const newSpots = newState.Spots.filter(spot => spot.id !== action.spotId);
            return {
                ...newState,
                spots: newSpots
            }
        default:
            return state;
    }
}

export default spotReducer
