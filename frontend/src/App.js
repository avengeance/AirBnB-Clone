import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import Spots from "./components/Spots";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const [spots, setSpots] = useState([]);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  // Use an effect to fetch the spots data from your backend API
  useEffect(() => {
    fetch("/api/spots")
      .then(res => res.json())
      .then(data => {
        setSpots(data);
      })
      .catch(err => console.log(err));
  }, [])

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          {/* Add a new route for the homepage and render the Spots component */}
          <Route exact path="/">
            <Spots spots={spots} />
          </Route>
        </Switch>
      )
      }
    </>
  );
}

export default App;
