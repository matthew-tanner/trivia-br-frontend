import {
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@material-ui/core/";
import React, { Component } from "react";
import { Redirect } from "react-router";
import { socket } from "../App";

interface User {
  userId: number;
  displayName: string;
  score: number;
}
interface GameState {
  currentQuestionId: number;
  selectedAnswer: string | number;
  disableButton: boolean;
  disableNext: boolean;
  score: number;
  correct: boolean;
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
  loadGame(): void;
  setGameStarted(): void;
  setGameStopped(): void;
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
      score: 0,
      correct: false,
    };

    this.startGame = this.startGame.bind(this);
    this.getNextQuestion = this.getNextQuestion.bind(this);
    this.endGame = this.endGame.bind(this);
  }

  startGame() {
    console.log("game starting...");
    //this.props.setGameStarted();
    socket.emit("startgame", { gameId: this.props.gameId }, (response: any) => {});
  }
  
  endGame(){
    socket.emit("endgame", {gameId: this.props.gameId});
  }

  getNextQuestion() {
    console.log("getting next question...");
    socket.emit("nextquestion", { gameId: this.props.gameId });
  }

  setAnswer(answer: string | number) {
    if (answer === this.props.questions[this.state.currentQuestionId].answer) {
      this.setState((prevState) => {
        return {
          selectedAnswer: answer,
          disableButton: true,
          correct: true,
          score: prevState.score + 1,
        };
      });
    } else {
      this.setState({ selectedAnswer: answer, disableButton: true });
    }
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
            correct: false,
          };
        })
      }
    });
    
    
    socket.on("gamestopped", (data) =>{
      this.props.setGameStopped();
    })
  }

  render() {
    if (!this.props.gameId) {
      return (
        <Redirect
          to={{
            pathname: "/home",
          }}
        />
      );
    }
    const buttonStyle = { margin: "1px", minWidth: "150px" };
    let startButton;
    let nextButton;
    let endButton;
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

    if (this.state.selectedAnswer && this.props.isHost && this.state.currentQuestionId < (this.props.questions.length - 1)) {
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

    if (this.props.isHost && this.props.gameStarted){
      endButton = (
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={buttonStyle}
          disabled={this.state.disableNext}
          onClick={this.endGame}
        >
          End Game{" "}
        </Button>
      )
    }

    if (this.state.correct) {
      waitForNext = <div>CORRECT! you answered with " {this.state.selectedAnswer} "</div>;
    } else {
      waitForNext = <div>INCORRECT! Waiting for next question...</div>;
    }

    if (this.props.gameStarted) {
      question = (
        <>
          <div
            dangerouslySetInnerHTML={{
              __html: this.props.questions[this.state.currentQuestionId].question,
            }}
          ></div>
        </>
      );
      if (this.state.correct) {
        socket.emit("correctanswer", {
          gameId: this.props.gameId,
          userId: this.props.userId,
          score: this.state.score,
        });
      }
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
            <div
            dangerouslySetInnerHTML={{
              __html: this.props.questions[this.state.currentQuestionId].answer,
            }}
          ></div>
            
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
              onClick={(e) => this.setAnswer(e.currentTarget.value)}
            ><div
            dangerouslySetInnerHTML={{
              __html: i[0],
            }}
          ></div>
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
              onClick={(e) => this.setAnswer(e.currentTarget.value)}
            ><div
            dangerouslySetInnerHTML={{
              __html: i[1],
            }}
          ></div>
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
              onClick={(e) => this.setAnswer(e.currentTarget.value)}
            ><div
            dangerouslySetInnerHTML={{
              __html: i[2],
            }}
          ></div>
            </Button>
          );
        }
      } else {
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
              onClick={(e) => this.setAnswer(e.currentTarget.value)}
            >
              {i[0]}
            </Button>
          );
        }
      }
    }

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card style={{ minHeight: "325px" }} variant="outlined">
            <CardContent>
              <Typography gutterBottom>
                {startButton}
                {endButton}
                {nextButton}
                
              </Typography>
            </CardContent>
              {this.props.gameStarted && <><CardContent><Typography gutterBottom>Question # {this.state.currentQuestionId + 1}</Typography>
              <Typography variant="h5" component="h2">
                {question}
              </Typography></CardContent></>}
            <Divider variant="middle" />
            <CardActions style={{ justifyContent: "center" }}>
              {!this.state.selectedAnswer && (
                <ButtonGroup orientation="vertical" color="primary">
                  {answers}
                </ButtonGroup>
              )}
              {this.state.selectedAnswer && waitForNext}
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card style={{ height: "325px" }} variant="outlined">
            <CardContent>
              <Typography gutterBottom>Player List</Typography>
            </CardContent>
            <Divider variant="middle" />
            <CardContent>
              <List component="nav">
                {this.props.userList.map((user: any) => {
                  return (
                    <ListItem button key={user.userId}>
                      <ListItemText>{user.displayName}</ListItemText>
                      <ListItemText>{this.state.score}</ListItemText>
                    </ListItem>
                  );
                })}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }
}
