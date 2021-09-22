import { Grid, Paper, TextField, Typography, Button } from "@material-ui/core";
import React, { Component } from "react";
import { socket } from "../App";

interface GameState {
  gameId: string,
  players: Array<string>
}

// interface GameProps {
//   auth: string,
// }

export class Game extends Component<{}, GameState> {
  state = {
    gameId: "",
    players: [],
  }

  handleSubmit(e: string) {
    if (e === "create"){
      socket.emit("creategame", {}, (response: any) => {
        console.log(`game created with id - ${response.gameId}`);
        this.setState({gameId: response.gameId, players: [...this.state.players, socket.id]})
      })
    }else{
      socket.emit("joingame", {gameId: this.state.gameId}, (response: any) => console.log(response))
    }
    // const {email, password } = this.state
    // socket.emit(
    //   "login",
    //   { email: email, password: password },
    //   (response: any) => {
    //     console.log(response);
    //     this.setState({redirect: response.status})
    //   }
    // );
  }

  componentDidMount(){
    socket.on("joinedgame", (data) => {
      console.log(data);
      this.setState({players: [...this.state.players, data.playerId]})
    })
  }

  render() {
    const buttonStyle = { marginTop: "10px" };
    // if (this.state.redirect === 1){
    //   console.log("successful login");
    //   return <Redirect to="/"/>
    // }
    return (
      <Grid container alignItems="center">
        <Button type="submit" variant="contained" color="primary" style={buttonStyle} onClick={() => this.handleSubmit("create")}>
          Create Game{" "}
        </Button>
        <Button type="submit" variant="contained" color="primary" style={buttonStyle} onClick={() => this.handleSubmit("join")}>
          Join Game{" "}
        </Button>
        <TextField
              fullWidth
              label="Email"
              placeholder="valid email address required"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                this.setState({ gameId: e.currentTarget.value });
              }}
            />
            {this.state.gameId}
            {this.state.players}
      </Grid>
    );
  }
}
