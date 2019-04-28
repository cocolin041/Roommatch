import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

// Include your new Components here
import House from '../House/house.jsx';
import User from '../User/user.jsx';
import FindRoom from '../FindRoom/findroom.jsx';
import Sublease from '../Sublease/sublease.jsx';
import FindRoommate from '../FindRoommate/findroommate.jsx';
import Recommend from '../Recommend/recommend.jsx';

class App extends Component {
  render() {
    return (
      // <Router>
      <Router>
        <Switch>
          <Route exact path="/" component={House}/>
          <Route exact path="/user" component={User}/>
          <Route exact path="/findroom" component={FindRoom}/>
          <Route exact path="/sublease" component={Sublease}/>
          <Route exact path="/findroommate" component={FindRoommate}/>
          <Route exact path="/recommend" component={Recommend}/>
        </Switch>
      </Router>
    );
  }
}

export default App;

