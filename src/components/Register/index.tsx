import React, { Component } from "react";
import { Button, Grid, Paper, TextField, Typography, Snackbar, IconButton } from "@material-ui/core";
import { socket } from "../App";
import CloseIcon from '@material-ui/icons/Close';
import { Redirect } from "react-router-dom";

interface RegisterState {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  alertOpen: boolean;
  success: boolean;
}

export class Register extends Component<{}, RegisterState> {
  constructor(props: any){
    super(props)
    this.state = {
      email: "",
      password: "",
      confirmPassword: "",
      displayName: "",
      alertOpen: false,
      success: false,
    }

    this.handleAlertClose = this.handleAlertClose.bind(this);
  }

  handleSubmit() {
    const {email, password, displayName } = this.state
    socket.emit(
      "register",
      { email: email, password: password, displayName: displayName },
      (response: any) => {
        if (response.status === 0){
          this.setState({alertOpen: true})
        }else if(response.status === 1){
          this.setState({success: true})
        }
      }
    );
  }

  handleAlertClose() {
    this.setState({ alertOpen: false });
  }

  render() {
    if (this.state.success) {
      return <Redirect to="/login" />;
    }
    const formStyle = { padding: "30px 20px", width: 300, margin: "20px auto" };
    const buttonStyle = { marginTop: "10px" };
    return (
      <Grid container alignItems="center">
        <Snackbar
            open={this.state.alertOpen}
            autoHideDuration={4000}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            onClose={this.handleAlertClose}
            message="Email or Display Name in use..."
            action={
              <React.Fragment>
                <IconButton size="small" aria-label="close" color="inherit" onClick={this.handleAlertClose}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </React.Fragment>
            }
          />
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
