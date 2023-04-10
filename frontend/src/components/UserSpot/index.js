import React, {useEffect,useState}  from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as spotActions from '../../store/spots';
import './UserSpot.css'

function UserSpots(){
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);
    const [spots, setSpots] = useState([]);

    useEffect(() => {
        dispatch(spotActions.getUserSpotsThunk(user.id))
            .then(spots => setSpots(spots))
            .catch(err => console.log(err));
    })

}

export default UserSpots
