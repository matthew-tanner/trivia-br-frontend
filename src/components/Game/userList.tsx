import {
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core/";
import React, { Component } from "react";
import { socket } from "../App";
import copy from "copy-to-clipboard";

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
  userId: number;
  setLeader(n: string): void;
}
export class UserList extends Component<UserListProps, UserListState> {
  constructor(props: UserListProps) {
    super(props);
    this.state = {
      userList: [],
    };

    this.getUserList = this.getUserList.bind(this);
    this.copyId = this.copyId.bind(this);
  }

  getUserList() {
    socket.emit("getgameinfo", { gameId: this.props.gameId }, (response: any) => {
      if (response.status === 1) {
        this.setState({
          userList: [...response.userList],
        });
      }
    });
  }

  copyId(){
    copy(this.props.gameId);
  }

  componentDidMount() {
    if (this.state.userList.length === 0) {
      this.getUserList();
    }
    socket.on("updateusers", (data) => {
      const list = data.userList.sort((a: any, b: any) => (a.score > b.score ? -1 : 1));
      this.setState({
        userList: list,
      });
      this.props.setLeader(list[0].displayName)
    });
  }

  render() {
    const listStyleUser = { background: "lightgreen" };
    const listStyle = { background: "white" };
    return (
      <Grid item xs={12} md={5}>
        <Card style={{ height: "325px" }} variant="outlined">
          <CardContent>
              <Chip
                label={`Player List for Game ID # ${this.props.gameId}`}
                color="primary"
                onClick={this.copyId}
              />
          </CardContent>
          <Divider variant="middle" />
          <CardContent style={{overflow: "auto"}}>
            <List component="nav">
              {this.state.userList.map((user: any) => {
                return (
                  <ListItem style={user.userId === this.props.userId ? listStyleUser : listStyle} button key={user.userId}>
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
