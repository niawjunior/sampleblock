import React, { Component } from "react";

import { BrowserRouter as Router, Switch } from "react-router-dom";
import { Route } from "react-router";

import Home from "./home";

class AppRoute extends Component {
  render() {
    return (
      <Router>
        <main className="flex-shrink-0">
          <div className="container">
            <Switch>
              <Route exact path="/" component={Home} />
            </Switch>
          </div>
        </main>
      </Router>
    );
  }
}

export default AppRoute;
