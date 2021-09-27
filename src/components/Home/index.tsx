import React, { Component } from "react";
import { Button, Card, Grid, TextField } from "@material-ui/core/";
import { socket } from "../App";
import { Redirect } from "react-router";

interface HomeState {
  gameId: string;
  joinGameId: string;
  displayName: string
}

interface HomeProps {
  gameId: string;
  setGameId(id: string): void
  setDisplayName(name: string): void
}
export class Home extends Component<HomeProps, HomeState> {
  state = {
    gameId: "",
    joinGameId: "",
    displayName: "",
  };

  handleSubmit(e: string) {
    if (e === "create") {
      socket.emit("creategame", {}, (response: any) => {
        console.log(`game created with id - ${response.gameId}`);
        
        this.setState({ gameId: response.gameId });
        this.props.setGameId(response.gameId);
        return (
          <Redirect
            to={{
              pathname: "/game",
            }}
          />
        );
      });
    } else {
      socket.emit("joingame", { gameId: this.state.joinGameId, displayName: this.state.displayName }, (response: any) =>{
        console.log(`game joined with id - ${response.gameId}`);
        this.props.setGameId(response.gameId);
        this.props.setDisplayName(this.state.displayName)
        return (
          <Redirect
            to={{
              pathname: "/game",
            }}
          />
        );
      });
    }
  }

  render() {
    const buttonStyle = { marginTop: "10px" };
    return (
      <Card>
        <Grid container alignItems="center">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={buttonStyle}
            onClick={() => this.handleSubmit("join")}
          >
            Join Game{" "}
          </Button>
          <TextField
              fullWidth
              label="Display Name"
              placeholder="enter display name"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                this.setState({ displayName: e.currentTarget.value });
              }}
            />
          <TextField
              fullWidth
              label="Game Id"
              placeholder="enter game id"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                this.setState({ joinGameId: e.currentTarget.value });
              }}
            />
        </Grid>
      </Card>
    );
  }
}
