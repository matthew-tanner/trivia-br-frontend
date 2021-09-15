import React from "react";
import { io } from "socket.io-client";
import Container from "@material-ui/core/Container";
import { Switch, Route, Redirect} from "react-router-dom";
import Home  from "../Home";
import MenuAppBar from "../Menu";
import Register from "../Register";

export const socket = io(`http://localhost:3000`);

socket.on("connect", () => {
  console.log("connected", socket.id);
});

function App() {
  return (
      <Container>
          <MenuAppBar />
          <div style={{marginTop: 80}}>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/register">
              <Register />
            </Route>
            <Route exact path="/login">
              <h1>Login Component</h1>
            </Route>
            <Route exact path="/join">
              <h1>Join Session Component</h1>
            </Route>
            <Route exact path="/dashboard">
              <h1>Dashboard Component</h1>
            </Route>
            <Redirect to="/" />
          </Switch>
          </div>
      </Container>
  );
}

export default App;
