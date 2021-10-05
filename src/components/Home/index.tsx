import React, { Component } from "react";
import { Button, Card, CardHeader, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, InputLabel, MenuItem, Select, Snackbar, TextField, Typography } from "@material-ui/core/";
import { socket } from "../App";
import CloseIcon from '@material-ui/icons/Close';
import { Redirect } from "react-router";

interface HomeState {
  gameId: string;
  joinGameId: string;
  open: boolean;
  numQuestions: number;
  categoryId: number;
  difficulty: string;
  type: string;
  alertOpen: boolean;
}

interface HomeProps {
  gameId: string;
  userId: number;
  displayName: string;
  setGameId(id: string): void;
  setInGame(): void;
  loadGame(): void;
  setIsHost(id: number): void;
  setUserId(id: number): void;
  setDisplayName(name: string): void;
}
export class Home extends Component<HomeProps, HomeState> {
  constructor(props: HomeProps) {
    super(props);
    this.state = {
      gameId: "",
      joinGameId: "",
      open: false,
      numQuestions: 5,
      categoryId: 0,
      difficulty: "any",
      type: "any",
      alertOpen: false,
    };
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNumChange = this.handleNumChange.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleDiffChange = this.handleDiffChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleAlertClose = this.handleAlertClose.bind(this);
  }
  handleSubmit() {
    this.setState({ open: false });
    let url = `https://opentdb.com/api.php?amount=${this.state.numQuestions}`;
    if (this.state.categoryId > 0) {
      url = url + `&category=${this.state.categoryId}`;
    }
    if (this.state.difficulty !== "any") {
      url = url + `&difficulty=${this.state.difficulty}`;
    }
    if (this.state.type !== "any") {
      url = url + `&type=${this.state.type}`;
    }
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.results.length > 0) {
          socket.emit(
            "creategame",
            {
              userId: Math.floor(Math.random() * 90000),
              displayName: `guest${(Math.random() + 1).toString(36).substring(5)}`,
              questions: data.results,
            },
            (response: any) => {
              console.log(response)
              console.log(`game created [id] ${response.gameId}`);
              this.setState({ gameId: response.gameId });
              this.props.setGameId(response.gameId);
              this.props.setUserId(response.userId);
              this.props.setIsHost(response.hostId);
              this.props.setDisplayName(response.displayName);
              this.props.setInGame();
              this.props.loadGame();
            }
          );
        } else {
          this.setState({ alertOpen: true });
        }
      });
  }

  handleJoin() {
    socket.emit(
      "joingame",
      {
        gameId: this.state.joinGameId,
        userId: Math.floor(Math.random() * 90000),
        displayName: `guest${(Math.random() + 1).toString(36).substring(5)}`,
      },
      (response: any) => {
        console.log(`game joined with id - ${response.gameId}`);
        this.props.setGameId(response.gameId);
        this.props.setUserId(response.userId);
        this.props.setIsHost(response.hostId);
        this.props.setDisplayName(response.displayName);
        this.props.setInGame();
        this.props.loadGame();
      }
    );
  }

  handleClickOpen = () => {
    this.setState({
      numQuestions: 5,
      categoryId: 0,
      difficulty: "any",
      type: "any",
      open: true,
    });
  };

  handleClose() {
    this.setState({ open: false });
  }
  handleAlertClose() {
    this.setState({ alertOpen: false });
  }

  handleNumChange(e: any) {
    this.setState({ numQuestions: +e.target.value });
  }

  handleCategoryChange(e: any) {
    this.setState({ categoryId: +e.target.value });
  }

  handleDiffChange(e: any) {
    this.setState({ difficulty: e.target.value });
  }

  handleTypeChange(e: any) {
    this.setState({ type: e.target.value });
  }

  render() {
    const buttonStyle = { margin: "10px", width: "130px", background: "primary" };
    const selectStyle = { marginTop: "5px", marginBottom: "5px" };
    const cardStyle = { marginTop: "10px", background: "#E8E8E8" }
    if (this.props.gameId) {
      return (
        <Redirect
          to={{
            pathname: "/game",
          }}
        />
      );
    }
    return (<>
    <Grid container style={{ width: "100%", background: "#595260", marginBottom: "10px"}} alignItems="center"
        justifyContent="center"><Typography style={{ textAlign: "center", color: "#E8E8E8", height: "20px" }}>Yet Another Trivia Game</Typography></Grid>
      <Grid container style={{ width: "100%", background: "#595260", margin: 0 }} alignItems="center"
        justifyContent="center"><img height="75px" src="./favicon.ico" /></Grid>
      <Grid
        style={{ height: "100%", width: "100%", background: "#595260", margin: 0 }}
        container
        alignItems="center"
        justifyContent="center">
        <Card style={cardStyle}>
          <CardHeader
            title="Public Games"
            style={{ textAlign: "center", background: "#F05454", color: "#E8E8E8", height: "20px" }}
          />
          <Snackbar
            open={this.state.alertOpen}
            autoHideDuration={4000}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            onClose={this.handleAlertClose}
            message="Category Error: No questions available"
            action={
              <React.Fragment>
                <IconButton size="small" aria-label="close" color="inherit" onClick={this.handleAlertClose}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </React.Fragment>
            }
          />
          <Grid container alignItems="center">
            <Grid item>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={buttonStyle}
                onClick={() => this.handleClickOpen()}
              >
                Create Game{" "}
              </Button>
            </Grid>
            <Divider />
            <Grid item>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={buttonStyle}
                disabled={this.state.joinGameId.length === 0}
                onClick={() => this.handleJoin()}
              >
                Join Game{" "}
              </Button>

              <TextField
                label="Game Code #"
                placeholder=""
                style={{ marginLeft: "5px", marginRight: "10px" }}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  this.setState({ joinGameId: e.currentTarget.value });
                }}
              />
            </Grid>
          </Grid>
          <Dialog fullWidth open={this.state.open} onClose={this.handleClose}>
            <DialogTitle>Create New Game</DialogTitle>
            <DialogContent>
              <InputLabel id="num-questions-label">Number of Questions</InputLabel>
              <Select
                labelId="num-questions-label"
                id="num-questions-select"
                name="numQuestions"
                style={selectStyle}
                value={this.state.numQuestions}
                label="# of Questions"
                onChange={this.handleNumChange}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={15}>15</MenuItem>
              </Select>
              <InputLabel id="category-label">Select Category</InputLabel>
              <Select
                labelId="category-label"
                id="category-select"
                style={selectStyle}
                name="categoryId"
                value={this.state.categoryId}
                label="Cateogory"
                onChange={this.handleCategoryChange}
              >
                <MenuItem value={0}>Any Category</MenuItem>
                <MenuItem value={9}>General Knowledge</MenuItem>
                <MenuItem value={10}>Entertainment: Books</MenuItem>
                <MenuItem value={11}>Entertainment: Film</MenuItem>
                <MenuItem value={12}>Entertainment: Music</MenuItem>
                <MenuItem value={14}>Entertainment: Television</MenuItem>
                <MenuItem value={15}>Entertainment: Video Games</MenuItem>
                <MenuItem value={16}>Entertainment: Board Games</MenuItem>
                <MenuItem value={32}>Entertainment: Cartoon Animation</MenuItem>
                <MenuItem value={17}>Science and Nature</MenuItem>
                <MenuItem value={18}>Science: Computers</MenuItem>
                <MenuItem value={19}>Science: Mathematics</MenuItem>
                <MenuItem value={21}>Sports</MenuItem>
                <MenuItem value={23}>History</MenuItem>
                <MenuItem value={26}>Celebrities</MenuItem>
              </Select>
              <InputLabel id="difficulty-label">Select Difficulty</InputLabel>
              <Select
                labelId="difficulty-label"
                id="difficulty-select"
                name="difficulty"
                style={selectStyle}
                value={this.state.difficulty}
                label="Difficulty"
                onChange={this.handleDiffChange}
              >
                <MenuItem value={"any"}>Any Difficulty</MenuItem>
                <MenuItem value={"easy"}>Easy</MenuItem>
                <MenuItem value={"medium"}>Medium</MenuItem>
                <MenuItem value={"hard"}>Hard</MenuItem>
              </Select>
              <InputLabel id="type-label">Select Type</InputLabel>
              <Select
                labelId="type-label"
                id="type-select"
                name="type"
                value={this.state.type}
                label="Type"
                onChange={this.handleTypeChange}
              >
                <MenuItem value={"any"}>Any Type</MenuItem>
                <MenuItem value={"multiple"}>Multiple Choice</MenuItem>
                <MenuItem value={"boolean"}>True / False</MenuItem>
              </Select>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose}>Cancel</Button>
              <Button onClick={this.handleSubmit}>Create</Button>
            </DialogActions>
          </Dialog>
        </Card>
      </Grid></>
    );
  }
}
