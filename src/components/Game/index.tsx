import { Button, Grid, List, ListItem, ListItemText } from "@material-ui/core/";
import React, { Component } from "react";
import { socket } from "../App";

interface User {
  userId: number;
  displayName: string;
}
interface GameState {
  currentQuestionId: number;
  selectedAnswer: string | number;
  disableButton: boolean;
  disableNext: boolean;
}

interface Question {
  question: string;
  type: string;
  answer: string;
  answers: Array<any>;
}
interface GameProps {
  gameId: string;
  userId: number;
  displayName: string;
  inGame: boolean;
  userList: User[];
  setUserList(): void;
  loadGame(): void;
  setGameStarted(): void;
  isHost: boolean;
  gameStarted: boolean;
  questions: Question[];
}
export class Game extends Component<GameProps, GameState> {
  constructor(props: GameProps) {
    super(props);
    this.state = {
      currentQuestionId: 0,
      selectedAnswer: "",
      disableButton: false,
      disableNext: false,
    };

    this.startGame = this.startGame.bind(this);
    this.getNextQuestion = this.getNextQuestion.bind(this);
  }

  startGame() {
    console.log("game starting...");
    //this.props.setGameStarted();
    socket.emit("startgame", { gameId: this.props.gameId }, (response: any) => {});
  }

  getNextQuestion() {
    console.log("getting next question...");
    socket.emit("nextquestion", { gameId: this.props.gameId });
  }

  setAnswer(answer: string | number) {
    this.setState({ selectedAnswer: answer, disableButton: true });
  }

  componentDidMount() {
    socket.on("joinedgame", (data) => {
      console.log(`player joined - ${data.displayName}`);
      this.props.loadGame();
    });

    socket.on("gamestarted", (data) => {
      if (!this.props.gameStarted) {
        this.props.setGameStarted();
      }
    });

    socket.on("getnextquestion", (data) => {
      if (this.state.currentQuestionId < this.props.questions.length - 1) {
        this.setState((prevState) => {
          return {
            selectedAnswer: "",
            currentQuestionId: prevState.currentQuestionId + 1,
            disableButton: false,
          };
        });
      }
    });
  }

  render() {
    const buttonStyle = { margin: "10px" };
    let startButton;
    let nextButton;
    let question;
    let answers = [];
    let waitForNext;
    if (this.props.isHost && !this.props.gameStarted) {
      startButton = (
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={buttonStyle}
          onClick={this.startGame}
        >
          Start Game{" "}
        </Button>
      );
    }

    if (this.state.selectedAnswer && this.props.isHost) {
      nextButton = (
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={buttonStyle}
          disabled={this.state.disableNext}
          onClick={this.getNextQuestion}
        >
          Next Question{" "}
        </Button>
      );
    }

    // if (this.state.selectedAnswer === this.props.questions[this.state.currentQuestionId].answer){
    //   waitForNext = (
    //     <div>CORRECT! you answered with " {this.state.selectedAnswer} "</div>
    //   )
    // }else{
    //   waitForNext = (
    //     <div>INCORRECT! Waiting for next question...</div>
    //   )
    // }

    if (this.props.gameStarted) {
      question = (
        <>
          <div>Question # {this.state.currentQuestionId + 1}</div>
          <div
            dangerouslySetInnerHTML={{
              __html: this.props.questions[this.state.currentQuestionId].question,
            }}
          ></div>
          <div>Answers</div>
        </>
      );
      if (this.props.questions[this.state.currentQuestionId].type === "multiple") {
        answers.push(
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={buttonStyle}
            disabled={this.state.disableButton}
            value={this.props.questions[this.state.currentQuestionId].answer}
            key={this.props.questions[this.state.currentQuestionId].answer}
            onClick={(e) => this.setAnswer(e.currentTarget.value)}
          >
            {this.props.questions[this.state.currentQuestionId].answer}
          </Button>
        );
        for (let i of this.props.questions[this.state.currentQuestionId].answers) {
          answers.push(
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={buttonStyle}
              key={i[0]}
              value={i[0]}
              disabled={this.state.disableButton}
              onClick={(e) => this.setState({ selectedAnswer: e.currentTarget.value })}
            >
              {i[0]}
            </Button>
          );
          answers.push(
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={buttonStyle}
              key={i[1]}
              value={i[1]}
              disabled={this.state.disableButton}
              onClick={(e) => this.setState({ selectedAnswer: e.currentTarget.value })}
            >
              {i[1]}
            </Button>
          );
          answers.push(
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={buttonStyle}
              key={i[2]}
              value={i[2]}
              disabled={this.state.disableButton}
              onClick={(e) => this.setState({ selectedAnswer: e.currentTarget.value })}
            >
              {i[2]}
            </Button>
          );
        }
      }else{
        answers.push(
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={buttonStyle}
            disabled={this.state.disableButton}
            value={this.props.questions[this.state.currentQuestionId].answer}
            key={this.props.questions[this.state.currentQuestionId].answer}
            onClick={(e) => this.setAnswer(e.currentTarget.value)}
          >
            {this.props.questions[this.state.currentQuestionId].answer}
          </Button>
        );
        for (let i of this.props.questions[this.state.currentQuestionId].answers) {
          answers.push(
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={buttonStyle}
              key={i[0]}
              value={i[0]}
              disabled={this.state.disableButton}
              onClick={(e) => this.setState({ selectedAnswer: e.currentTarget.value })}
            >
              {i[0]}
            </Button>
          );
        }
      }
    }

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <div>Player List</div>
          <List component="nav">
            {this.props.userList.map((user: any) => {
              return (
                <ListItem button key={user.userId}>
                  <ListItemText>{user.displayName}</ListItemText>
                </ListItem>
              );
            })}
          </List>
        </Grid>
        <Grid item xs={12} md={7}>
          <div>Trivia</div>
          <div>
            {startButton} {nextButton}
          </div>
          {question}
          {!this.state.selectedAnswer && answers}
          {this.state.selectedAnswer && waitForNext}
        </Grid>
      </Grid>
    );
  }
}
