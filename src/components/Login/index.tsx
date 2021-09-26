import { Grid, Paper, TextField, Typography, Button } from "@material-ui/core";
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { socket } from "../App";

interface LoginState {
  email: string;
  password: string;
  redirect: number;
}

interface LoginProps {
  token: string;
  updateToken: (newToken: string) => void;
  setUserId: (id: number) => void;
  setDisplayName: (name: string) => void;
}

export class Login extends Component<LoginProps, LoginState> {
  state = {
    email: "",
    password: "",
    redirect: 0,
  };

  handleSubmit() {
    const { email, password } = this.state;

    socket.emit("login", { email: email, password: password }, (response: any) => {
      console.log(response.sessionToken);
      this.setState({ redirect: response.status });
      this.props.updateToken(response.sessionToken);
      this.props.setUserId(response.userId);
      this.props.setDisplayName(response.displayName);
    });
  }

  render() {
    const formStyle = { padding: "30px 20px", width: 300, margin: "20px auto" };
    const buttonStyle = { marginTop: "10px" };
    if (this.state.redirect === 1) {
      console.log("successful login");
      return <Redirect to="/dashboard" />;
    }
    return (
      <Grid container alignItems="center">
        <Paper elevation={20} style={formStyle}>
          <Grid>
            <Typography align="center" variant="h5">
              Login
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
            <Button type="submit" variant="contained" color="primary" style={buttonStyle}>
              Sign In{" "}
            </Button>
          </form>
        </Paper>
      </Grid>
    );
  }
}
