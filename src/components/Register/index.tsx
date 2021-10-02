import React, { Component } from "react";
import { Button, Grid, Paper, TextField, Typography } from "@material-ui/core";
import { socket } from "../App";

interface RegisterState {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
}

export class Register extends Component<{}, RegisterState> {
  state = {
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
  };

  handleSubmit() {
    const {email, password, displayName } = this.state
    socket.emit(
      "register",
      { email: email, password: password, displayName: displayName },
      (response: any) => {
      }
    );
  }

  render() {
    const formStyle = { padding: "30px 20px", width: 300, margin: "20px auto" };
    const buttonStyle = { marginTop: "10px" };
    return (
      <Grid container alignItems="center">
        <Paper elevation={20} style={formStyle}>
          <Grid>
            <Typography align="center" variant="h5">
              Register for an Account
            </Typography>
          </Grid>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              this.handleSubmit();
            }}
          >
            <TextField
              fullWidth
              label="Email"
              placeholder="valid email address required"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                this.setState({ email: e.currentTarget.value });
              }}
            />
            <TextField
              type="password"
              fullWidth
              label="Password"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                this.setState({ password: e.currentTarget.value });
              }}
            />
            <TextField
              type="password"
              fullWidth
              label="Confirm Password"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                this.setState({ confirmPassword: e.currentTarget.value });
              }}
            />
            <TextField
              fullWidth
              label="Display Name"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                this.setState({ displayName: e.currentTarget.value });
              }}
            />
            <Button type="submit" variant="contained" color="primary" style={buttonStyle}>
              Sign Up{" "}
            </Button>
          </form>
        </Paper>
      </Grid>
    );
  }
}
