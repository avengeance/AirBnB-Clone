function UserSpots() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);
    const [spots, setSpots] = useState([]);

    useEffect(() => {
        dispatch(spotActions.getUserSpotsThunk(user.id))
            .then(spots => {
                const userSpots = spots.Spots
                setSpots(userSpots)
            })

    }, [])

    return (
        <div>
            <h2>Manage Your Spots</h2>
            {spots.length === 0 && (
                <div id='create-spot-button'>
                    <button onClick={() => window.location.href = '/create-spot'}>
                        Create a New Spot
                    </button>
                </div>
            )}
            <div className='spot-tile-container'>
                {spots.map(spot => (
                    <div className='spot-tile'
                        key={spot.id}
                        onClick={() => window.location.href = `/spots/${spot.id}`}>
                        <img src={spot.previewImage} alt={spot.name} id='spot-tile-image' />
                        <div id='spot-city-state'>{spot.city}, {spot.state}
                            <div title={spot.name} >
                                <i className="fas fa-star"></i>
                                {spot.numReviews && spot.numReviews.length === 0 ? 'New' : (spot.avgRating ? spot.avgRating.toFixed(1) : "New")}
                            </div>
                        </div>
                        <div id='spot-tile-price'>
                            <div id='tile-price'>{spot.price}</div>
                            night
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

}

export default UserSpots
