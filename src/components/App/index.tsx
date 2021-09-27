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

interface User {
  userId: number;
  displayName: string;
}

interface Question {
  question: string;
  type: string;
  answer: string;
  answers: Array<string>
}

interface AppProps {}
interface AppState {
  token: string;
  gameId: string;
  userId: number;
  displayName: string;
  inGame: boolean;
  userList: User[];
  isHost: boolean;
  gameStarted: boolean;
  questions: Question[];
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
      userList: [],
      isHost: false,
      gameStarted: false,
      questions: []
    };

    this.updateToken = this.updateToken.bind(this);
    this.clearToken = this.clearToken.bind(this);
    this.setGameId = this.setGameId.bind(this);
    this.setUserId = this.setUserId.bind(this);
    this.setDisplayName = this.setDisplayName.bind(this);
    this.setInGame = this.setInGame.bind(this);
    this.setUserList = this.setUserList.bind(this);
    this.loadGame = this.loadGame.bind(this);
    this.setIsHost = this.setIsHost.bind(this);
    this.setGameStarted = this.setGameStarted.bind(this);
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
      userId: 0,
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

  setUserList() {
    socket.emit("getgameinfo", {gameId: this.state.gameId}, (response: any) =>{
      this.setState({
        userList: response.userList
      });
    })
  }

  setIsHost(id: number) {
    if(id === this.state.userId){
      this.setState({isHost: true})
    }
  }

  setInGame() {
    this.state.inGame ? this.setState({ inGame: false }) : this.setState({ inGame: true });
  }

  setGameStarted(){
    this.state.gameStarted ? this.setState({gameStarted: false}) : this.setState({gameStarted: true})
  }

  loadGame() {
    console.log("gameid - ", this.state.gameId);
    socket.emit(
      "getgameinfo",
      { gameId: this.state.gameId },
      (response: any) => {
        console.log(response);
        if (response.status === 1) {
          this.setState({
            userList: [...response.userList],
            questions: [...response.questions]
          })
        }
      }
    );
  }


  componentDidMount() {
    if (localStorage.getItem("token") !== "null") {
      this.setState({ token: localStorage.getItem("token") || "" });
      socket.emit("userinfo", { token: localStorage.getItem("token") }, (response: any) => {
        console.log(response);
        this.setState({
          userId: response.userId,
          displayName: response.displayName,
        });
      });
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
              component={() => (
                <Dashboard
                  gameId={this.state.gameId}
                  userId={this.state.userId}
                  displayName={this.state.displayName}
                  setGameId={this.setGameId}
                  setInGame={this.setInGame}
                  loadGame={this.loadGame}
                  setIsHost={this.setIsHost}
                />
              )}
            ></Route>
            <Route
              exact
              path="/game"
              component={() => (
                <Game
                  gameId={this.state.gameId}
                  inGame={this.state.inGame}
                  userId={this.state.userId}
                  displayName={this.state.displayName}
                  userList={this.state.userList}
                  isHost={this.state.isHost}
                  gameStarted={this.state.gameStarted}
                  questions={this.state.questions}
                  setUserList={this.setUserList}
                  loadGame={this.loadGame}
                  setGameStarted={this.setGameStarted}
                />
              )}
            />
            <Redirect to="/" />
          </Switch>
        </div>
      </Container>
    );
  }
}

export default App;
