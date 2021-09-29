import React, { Component } from "react";
import { Button, Card, Grid, TextField } from "@material-ui/core/";
import { socket } from "../App";
import { Redirect } from "react-router";

interface HomeState {

}

interface HomeProps {

}
export class Home extends Component<HomeProps, HomeState> {
  state = {

  };

  render() {
    return (
      <Grid
        style={{height:"100%"}}
        container
        alignItems="center"
        justifyContent="center">
          <Grid item><img src="../assets/logo.png" alt="logo" width="350px"/></Grid>
        </Grid>
    );
  }
}
