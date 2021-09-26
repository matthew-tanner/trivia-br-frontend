import React from "react";
import { io } from "socket.io-client";
import Container from "@material-ui/core/Container";
import { Switch, Route, Redirect } from "react-router-dom";
import { Home } from "../Home";
import MenuAppBar from "../Menu";
import { Register } from "../Register";
import { Login } from "../Login";
import { Game } from "../Game";
import { Dashboard } from "../Dashboard";

export const socket = io(`http://localhost:3000`);

socket.on("connect", () => {
  console.log("connected", socket.id);
});

interface AppProps {}
interface AppState {
  token: string;
  gameId: string;
  userId: number;
  displayName: string;
  inGame: boolean;
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      token: "",
      gameId: "",
      userId: 0,
      displayName: "",
      inGame: false,
    };

    this.updateToken = this.updateToken.bind(this);
    this.clearToken = this.clearToken.bind(this);
    this.setGameId = this.setGameId.bind(this);
    this.setUserId = this.setUserId.bind(this);
    this.setDisplayName = this.setDisplayName.bind(this);
    this.setInGame = this.setInGame.bind(this);
  }
  updateToken(newToken: string) {
    localStorage.setItem("token", newToken);
    this.setState({ token: newToken });
  }

  clearToken() {
    console.log("test");
    localStorage.removeItem("token");
    this.setState({ 
      token: "",
      displayName: "",
      userId: 0
    });
  }

  setGameId(id: string) {
    this.setState({ gameId: id });
  }

  setUserId(id: number) {
    this.setState({ userId: id });
  }

  setDisplayName(name: string) {
    this.setState({ displayName: name });
  }

  setInGame() {
    this.state.inGame ? this.setState({inGame: false}) : this.setState({inGame: true})
  }

  componentDidMount() {
    if (localStorage.getItem("token") !== "null") {
      this.setState({ token: localStorage.getItem("token") || "" });
      socket.emit("userinfo", {token: localStorage.getItem("token")}, (response: any) =>{
        console.log(response);
        this.setState({
          userId: response.userId,
          displayName: response.displayName
        })
      })
    }
  }

  render() {
    return (
      <Container>
        <MenuAppBar token={this.state.token} clearToken={this.clearToken} />
        <div style={{ marginTop: 80 }}>
          <Switch>
            <Route exact path="/">
              <Home
                gameId={this.state.gameId}
                setGameId={this.setGameId}
                setDisplayName={this.setDisplayName}
              />
            </Route>
            <Route exact path="/register" component={Register}></Route>
            <Route
              exact
              path="/login"
              component={() => (
                <Login
                  token={this.state.token}
                  updateToken={this.updateToken}
                  setUserId={this.setUserId}
                  setDisplayName={this.setDisplayName}
                />
              )}
            ></Route>
            <Route exact path="/join" component={Game}></Route>
            <Route
              exact
              path="/dashboard"
              component={() => <Dashboard gameId={this.state.gameId} userId={this.state.userId} setGameId={this.setGameId} setInGame={this.setInGame} />}
            ></Route>
            <Route exact path="/game" component={() => <Game gameId={this.state.gameId} inGame={this.state.inGame} userId={this.state.userId} displayName={this.state.displayName}/>} />
            <Redirect to="/" />
          </Switch>
        </div>
      </Container>
    );
  }
}

export default App;
