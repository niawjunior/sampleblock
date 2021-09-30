import React, { Component } from "react";

import { BrowserRouter as Router, Switch } from "react-router-dom";
import { Route } from "react-router";

import Main from "./main";

class AppRoute extends Component {
  render() {
    return (
      <Router>
        <main className="flex-shrink-0">
          <div className="container">
            <Switch>
              <Route exact path="/" component={Main} />
            </Switch>
          </div>
        </main>
      </Router>
    );
  }
}

export default AppRoute;
