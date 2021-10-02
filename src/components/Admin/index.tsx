import React, { Component } from "react";
import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
} from "@material-ui/core/";
import CloseIcon from '@material-ui/icons/Close';
import { socket } from "../App";
import { Redirect } from "react-router";

interface AdminState {

}

interface AdminProps {
  gameId: string;
  userId: number;
  displayName: string;
  isAdmin: boolean;
}
export class Admin extends Component<AdminProps, AdminState> {
  constructor(props: AdminProps) {
    super(props);
    this.state = {

    };
  }

  render() {
    if (!this.props.isAdmin) {
      return (
        <Redirect
          to={{
            pathname: "/home",
          }}
        />
      );
    }
    return (
        <div>
            test
        </div>
    );
  }
}
