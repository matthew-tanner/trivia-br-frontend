import { Card, CardContent, Divider, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";
import React, { Component } from "react";
import { Redirect } from "react-router";
import { socket } from "../App";


interface User {
  userId: number;
  displayName: string;
  score: number;
}

interface Game {
  gameId: string;
  hostId: number;
  id: number;
  userList: User[];
  winner: string;
}

interface AdminState {
  completedGames: Game[];
}

interface AdminProps {
  token: string;
  userId: number;
  displayName: string;
  isAdmin: boolean;
}
export class Admin extends Component<AdminProps, AdminState> {
  constructor(props: AdminProps) {
    super(props);
    this.state = {
      completedGames: []
    };
  }

  getGames() {
    socket.emit("admingamedata", { token: this.props.token, userId: this.props.userId }, (response: any) => {
      let gameData: any = [];
      console.log(response);
      if (response.games) {
        response.games.map((x: any) => {
          gameData.push({
            gameId: x.gameId,
            hostId: x.hostId,
            id: x.id,
            userList: x.userList,
            winner: x.winner
          })
        })
        this.setState({
          completedGames: gameData
        })
      }
    })
  }

  componentDidMount() {
    this.getGames();
  }

  render() {
    const headerText = {color: "#E8E8E8"}
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
      <Grid container spacing={3} alignItems="center"
      justifyContent="center">
        <Grid item xs={12} md={7}>
          <Card style={{ minHeight: "325px", background:"#E8E8E8" }} variant="outlined">
            <CardContent style={{background:"#F05454"}}>
              <Typography style={{color: "#E8E8E8"}} align="center">Games Completed Today</Typography>
            </CardContent>
            <Divider />
            <CardContent>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead style={{ background: "#F05454"}}>
                    <TableRow>
                      <TableCell style={headerText}>Game#</TableCell>
                      <TableCell style={headerText}>Host</TableCell>
                      <TableCell style={headerText}>Winner</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.completedGames.map((row) => (
                      <TableRow key={row.gameId}>
                        <TableCell component="th" scope="row">
                          {row.gameId}
                        </TableCell>
                        <TableCell>{row.hostId}</TableCell>
                        <TableCell>{row.winner}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>

          </Card>
        </Grid>
      </Grid >
    );
  }
}
