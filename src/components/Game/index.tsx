import { Grid, List, ListItem, ListItemText } from "@material-ui/core/";
import React, { Component } from "react";
import { socket } from "../App";

interface Question {
  question: string;
  type: string;
  answer: string;
  answers: string;
}

interface User {
  userId: number;
  displayName: string;
}
interface GameState {
  inGame: boolean;
  userList: User[];
  questions: Question[];
}

interface GameProps {
  gameId: string;
  userId: number;
  displayName: string;
  inGame: boolean;
}
export class Game extends Component<GameProps, GameState> {
  state = {
    inGame: false,
    userList: [],
    questions: [],
  };

  joinGame() {
    console.log("gameid - ", this.props.gameId);
    socket.emit(
      "joingame",
      { gameId: this.props.gameId, userId: this.props.userId, displayName: this.props.displayName },
      (response: any) => {
        console.log(response);
        if (response.status === 1) {
          this.setState({ inGame: true });
          this.setState((prevState) => ({
            userList: [
              ...prevState.userList,
              { userId: this.props.userId, displayName: this.props.displayName },
            ],
          }));
        }
      }
    );
  }

  componentDidMount() {
    socket.on("joinedgame", (data) => {
      console.log(`player joined - ${data.displayName}`);
    });
    if (this.props.inGame) {
      this.joinGame();
    }
  }

  render() {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <div>Player List</div>
          <List component="nav">
            {this.state.userList.map((user: any) => {
              return (
                <ListItem button key={user.userId}>
                  <ListItemText>{user.displayName}</ListItemText>
                </ListItem>
              );
            })}
          </List>
        </Grid>
        <Grid item xs={12} md={7}>
          <div>Trivia</div>
        </Grid>
      </Grid>
    );
  }
}
