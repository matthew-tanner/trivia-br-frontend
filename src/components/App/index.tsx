import React from "react";
import { io } from "socket.io-client";
import Container from "@material-ui/core/Container";
import { Switch, Route, Redirect, Link } from "react-router-dom";

export const socket = io(`http://localhost:3000`);

socket.on("connect", () => {
  console.log("connected", socket.id);
});

function App() {
  return (
    <div className="App">
      <Container maxWidth="sm">
        <div>
          <Link to="/">Home Page</Link> |
          <Link to="/register">Register</Link>
        </div>
        <Switch>
          <Route exact path="/">
            <h1>Home Page</h1>
          </Route>
          <Route exact path="/register">
            <h1>Sign Up</h1>
          </Route>
          <Route exact path="/login">
            <h1>Sign Up</h1>
          </Route>
          <Redirect to="/" />
        </Switch>
      </Container>
    </div>
  );
}

export default App;
