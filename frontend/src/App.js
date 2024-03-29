import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";

import * as sessionActions from "./store/session";
import * as spotActions from "./store/spots";
import Navigation from "./components/Navigation";
import Spots from "./components/Spots";
import SpotDetail from "./components/SpotDetail/SpotDetail";
import CreateSpot from "./components/CreateSpot";
import UserSpots from "./components/UserSpot";
import EditSpot from "./components/EditSpot";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
    dispatch(spotActions.getSpotsThunk());
    setIsLoaded(true);
  }, [dispatch]);


  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <Spots />
          </Route>
          <Route exact path="/spots/new">
            <CreateSpot />
          </Route>
          <Route exact path='/spots/current' component={UserSpots}>
            <UserSpots />
          </Route>
          <Route path="/spots/:spotId/edit" component={EditSpot}>
            <EditSpot />
          </Route>
          <Route exact path="/spots/:spotId" spot={SpotDetail}>
            <SpotDetail />
          </Route>
        </Switch>
      )
      }
    </>
  );
}

export default App;
