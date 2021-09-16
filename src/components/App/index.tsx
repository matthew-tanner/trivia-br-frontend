import React from "react";
import { io } from "socket.io-client";
import Container from "@material-ui/core/Container";
import { Switch, Route, Redirect } from "react-router-dom";
import Home from "../Home";
import MenuAppBar from "../Menu";
import { Register } from "../Register";
import { Login } from "../Login";

export const socket = io(`http://localhost:3000`);

socket.on("connect", () => {
  console.log("connected", socket.id);
});

interface AppProps{
  sessionToken: string,
}

interface AppState {
  sessionToken: AppProps
}

class App extends React.Component<AppProps, AppState> {
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
            <Route exact path="/login" component={() => <Login auth={this.props.sessionToken}/>}></Route>
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
}

export default App;
