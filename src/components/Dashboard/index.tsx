import React, { Component } from "react";
import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core/";
import { socket } from "../App";
import { Redirect } from "react-router";

interface DashboardState {
  gameId: string;
  joinGameId: string;
  open: boolean;
  numQuestions: number;
  categoryId: number;
  difficulty: string;
  type: string;
}

interface DashboardProps {
  gameId: string;
  userId: number;
  setGameId(id: string): void;
  setInGame(): void;
}
export class Dashboard extends Component<DashboardProps, DashboardState> {
  constructor(props: DashboardProps) {
    super(props);
    this.state = {
      gameId: "",
      joinGameId: "",
      open: false,
      numQuestions: 5,
      categoryId: 0,
      difficulty: "any",
      type: "any",
    };
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNumChange = this.handleNumChange.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleDiffChange = this.handleDiffChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
  }

  handleSubmit() {
    this.setState({ open: false });
    let url = `https://opentdb.com/api.php?amount=${this.state.numQuestions}`;
    if (this.state.categoryId > 0) {
      url = url + `&category=${this.state.categoryId}`
    }
    if (this.state.difficulty !== "any") {
      url = url + `&difficulty=${this.state.difficulty}`
    }
    if (this.state.type !== "any") {
      url = url + `&type=${this.state.type}`
    }
    console.log(url);
    fetch(url)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      socket.emit("creategame", {userId: this.props.userId, questions: data.results}, (response: any) =>{
        console.log(`game created [id] ${response.gameId}`);
        this.setState({gameId: response.gameId});
        this.props.setGameId(response.gameId);
        this.props.setInGame();
      })
    })
    //   socket.emit("joingame", { gameId: this.state.joinGameId }, (response: any) => {
    //     console.log(`game joined with id - ${response.gameId}`);
    //     this.props.setGameId(response.gameId);
    //   });
    // }
  }

  handleClickOpen = () => {
    this.setState({
      numQuestions: 5,
      categoryId: 0,
      difficulty: "any",
      type: "any",
      open: true
    });
  };

  handleClose() {
    this.setState({ open: false });
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
            onClick={() => this.handleClickOpen()}
          >
            Create Game{" "}
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={buttonStyle}
            onClick={() => this.handleSubmit()}
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
        <Dialog open={this.state.open} onClose={this.handleClose}>
          <DialogTitle>Create New Game</DialogTitle>
          <DialogContent>
            <DialogContentText>All fields are required.</DialogContentText>
            <InputLabel id="num-questions-label">Number of Questions</InputLabel>
            <Select
              labelId="num-questions-label"
              id="num-questions-select"
              name="numQuestions"
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
    );
  }
}
