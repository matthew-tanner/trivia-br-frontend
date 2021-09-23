import { Grid } from "@material-ui/core";
import React, { Component } from "react";
import { socket } from "../App";

interface GameState {
  gameId: string,
  inGame: boolean,
}

interface GameProps {
  gameId: string,
}

export class Game extends Component<GameProps, GameState> {
  state = {
    gameId: "",
    inGame: false
  }

  joinGame(){
    console.log("gameid - ", this.props.gameId)
    socket.emit("joingame", {gameId: this.state.gameId}, (response: any) => {
      if(response.status === 1){
        this.setState({inGame: true})
      }
    })
  }

  componentDidMount(){
    socket.on("joinedgame", (data) => {
      console.log(`player joined - ${data.displayName}`);
    })
    if(this.state.inGame){
      this.joinGame();
    }
  }

  render() {
    return (
      <Grid container alignItems="center">
            {this.props.gameId}
      </Grid>
    );
  }
}
