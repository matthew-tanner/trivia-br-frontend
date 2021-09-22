import React from "react";
import { io } from "socket.io-client";
import Container from "@material-ui/core/Container";
import { Switch, Route, Redirect } from "react-router-dom";
import Home from "../Home";
import MenuAppBar from "../Menu";
import { Register } from "../Register";
import { Login } from "../Login";
import { Game } from "../Game";

export const socket = io(`http://localhost:3000`);

socket.on("connect", () => {
  console.log("connected", socket.id);
});

interface AppProps {

}
interface AppState {
  token: string;
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps){
    super(props);
    this.state = {
      token: "",
    }

    this.updateToken = this.updateToken.bind(this);
    this.clearToken = this.clearToken.bind(this);
  }
  updateToken(newToken: string) {
    localStorage.setItem("token", newToken);
    this.setState({ token: newToken });
  }

  clearToken() {
    console.log("test")
    localStorage.removeItem("token");
    this.setState({ token: "" });
  }

  componentDidMount() {
    if (localStorage.getItem("token") !== "null"){
      this.setState({ token: localStorage.getItem("token") || "" });
    }
  }

  render() {
    return (
      <Container>
        <MenuAppBar token={this.state.token} clearToken={this.clearToken} />
        <div style={{ marginTop: 80 }}>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/register" component={Register}></Route>
            <Route exact path="/login" component={() => <Login token={this.state.token} updateToken={this.updateToken} />}></Route>
            <Route exact path="/join" component={Game}></Route>
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
