import {
  Card,
  CardContent,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@material-ui/core/";
import React, { Component } from "react";
import { socket } from "../App";

interface User {
  userId: number;
  displayName: string;
  score: number;
}

interface UserListState {
  userList: User[];
}
interface UserListProps {
  gameId: string;
}
export class UserList extends Component<UserListProps, UserListState> {
  constructor(props: UserListProps) {
    super(props);
    this.state = {
      userList: [],
    };

    this.getUserList = this.getUserList.bind(this);
  }

  getUserList() {
    socket.emit("getgameinfo", { gameId: this.props.gameId }, (response: any) => {
      console.log(response);
      if (response.status === 1) {
        this.setState({
          userList: [...response.userList],
        });
      }
    });
  }

  componentDidMount() {
    if(this.state.userList.length === 0){
      this.getUserList();
    }
    socket.on("updateusers", (data) => {
      console.log("getting update user data", data.userList);
      this.setState({
        userList: data.userList,
      });
    });
  }

  render() {
    return (
      <Grid item xs={12} md={5}>
        <Card style={{ height: "325px" }} variant="outlined">
          <CardContent>
            <Typography gutterBottom>Player List</Typography>
          </CardContent>
          <Divider variant="middle" />
          <CardContent>
            <List component="nav">
              {this.state.userList.map((user: any) => {
                return (
                  <ListItem button key={user.userId}>
                    <ListItemText>{user.displayName}</ListItemText>
                    <ListItemText>{user.score}</ListItemText>
                  </ListItem>
                );
              })}
            </List>
          </CardContent>
        </Card>
      </Grid>
    );
  }
}
