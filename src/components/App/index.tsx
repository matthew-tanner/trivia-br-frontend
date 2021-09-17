import React from "react";
import { io } from "socket.io-client";
import Container from "@material-ui/core/Container";
import { Switch, Route, Redirect } from "react-router-dom";
import Home from "../Home";
import MenuAppBar from "../Menu";
import { Register } from "../Register";
import { Login } from "../Login";
import {Game} from "../Game";

export const socket = io(`http://localhost:3000`);

socket.on("connect", () => {
  console.log("connected", socket.id);
});

interface AppState {
  sessionToken: string
}

class App extends React.Component<{}, AppState> {
  render() {
    return (
      <Container>
        <MenuAppBar />
        <div style={{ marginTop: 80 }}>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/register" component={Register}></Route>
            <Route exact path="/login" component={() => <Login auth={this.state.sessionToken}/>}></Route>
            <Route exact path="/join" component={Game}>
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
}

export default App;
