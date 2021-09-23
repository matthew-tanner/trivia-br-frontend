import React, { Component } from "react";
import { Button, Card, Grid, TextField } from "@material-ui/core/";
import { socket } from "../App";
import { Redirect } from "react-router";

interface DashboardState {
  gameId: string;
  joinGameId: string;
}

interface DashboardProps {
  gameId: string
  setGameId(id: string): void
}
export class Dashboard extends Component<DashboardProps, DashboardState> {
  state = {
    gameId: "",
    joinGameId: ""
  };

  handleSubmit(e: string) {
    if (e === "create") {
      socket.emit("creategame", {}, (response: any) => {
        console.log(`game created with id - ${response.gameId}`);
        
        this.setState({ gameId: response.gameId });
        this.props.setGameId(response.gameId);
      });
    } else {
      socket.emit("joingame", { gameId: this.state.joinGameId }, (response: any) =>{
        console.log(`game joined with id - ${response.gameId}`);
        this.props.setGameId(response.gameId);
      });
    }
  }

  render() {
    const buttonStyle = { marginTop: "10px" };
    if (this.props.gameId) {
      return (
        <Redirect
          to={{
            pathname: "/game",
          }}
        />
      );
    }
    return (
      <Card>
        <Grid container alignItems="center">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={buttonStyle}
            onClick={() => this.handleSubmit("create")}
          >
            Create Game{" "}
          </Button>
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
              label="Email"
              placeholder="valid email address required"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                this.setState({ joinGameId: e.currentTarget.value });
              }}
            />
        </Grid>
      </Card>
    );
  }
}
