import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Typography,
} from "@material-ui/core/";
import React, { Component } from "react";
import { Redirect } from "react-router";
import { socket } from "../App";
import { UserList } from "./userList";

interface GameState {
  currentQuestionId: number;
  selectedAnswer: string | number;
  disableButton: boolean;
  disableNext: boolean;
  score: number;
  correct: boolean;
  counter: number;
  open: boolean;
  leader: string;
  sentAnswer: boolean;
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
  loadGame(): void;
  setGameStarted(): void;
  setGameStopped(): void;
  isHost: boolean;
  gameStarted: boolean;
  questions: Question[];
}
export class Game extends Component<GameProps, GameState> {
  private _Counter: any;
  constructor(props: GameProps) {
    super(props);
    this.state = {
      currentQuestionId: 0,
      selectedAnswer: "",
      disableButton: false,
      disableNext: false,
      score: 0,
      correct: false,
      counter: 15,
      open: false,
      leader: "",
      sentAnswer: false,
    };

    this.startGame = this.startGame.bind(this);
    this.getNextQuestion = this.getNextQuestion.bind(this);
    this.endGame = this.endGame.bind(this);
    this.setDisableButton = this.setDisableButton.bind(this);
    this.setCounter = this.setCounter.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.setLeader = this.setLeader.bind(this);
  }

  startGame() {
    console.log("game starting...");
    socket.emit("startgame", { gameId: this.props.gameId }, (response: any) => { });
    socket.emit("questioncountdown", { gameId: this.props.gameId })
  }

  endGame() {
    socket.emit("endgame", { gameId: this.props.gameId });
  }

  getNextQuestion() {
    console.log("getting next question...");
    socket.emit("nextquestion", { gameId: this.props.gameId });
    this.setState({sentAnswer: false})
    //socket.emit("questioncountdown", { gameId: this.props.gameId })
  }

  setDisableButton() {
    this.setState({ disableButton: true })
  }

  setCounter(i: number) {
    if (this.state.counter === 0 && this.state.currentQuestionId === this.props.questions.length - 1) {
      this.setState({ counter: i, open: true })
    }
    this.setState({ counter: i })
  }

  handleClose() {
    this.endGame();
    this.setState({ open: false });
  }

  setLeader(name: string) {
    this.setState({ leader: name })
  }

  setAnswer(answer: string | number) {
    if (answer === this.props.questions[this.state.currentQuestionId].answer) {
      this.setState((prevState) => {
        return {
          selectedAnswer: answer,
          correct: true,
          score: prevState.score + Math.round((this.state.counter * 100) / 15),
        };
      });
    } else {
      this.setState({ selectedAnswer: answer});
    }
  }

  countDown() {
    this._Counter = setInterval(() => {
      const time = this.state.counter;
      if (time > 0) {
        this.setState((prevState)=>{
          return{counter: prevState.counter -1}
        })
      } else {
        if(this.state.currentQuestionId === this.props.questions.length -1){
          this.setState({open: true, disableButton: true})
        }else{
          this.setState({disableButton: true})
        }
        clearInterval(this._Counter);
      }
    }, 1000)
  }

  componentDidUpdate(){
    if (this.state.correct && !this.state.sentAnswer){
      this.setState({sentAnswer: true})
      socket.emit("correctanswer", {
        gameId: this.props.gameId,
        userId: this.props.userId,
        score: this.state.score,
      });
    }
  }

  componentDidMount() {
    this.countDown();

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
            counter: 15,
            sentAnswer: false
          };
        });
        this.countDown();
      }
    });

    socket.on("gamestopped", (data) => {
      this.props.setGameStopped();
    });
  }

  componentWillUnmount() {
    clearInterval(this._Counter);
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
    const progress = (this.state.counter * 100) / 15
    let startButton;
    let nextButton;
    let endButton;
    let question;
    let answers = [];
    let waitForNext;
    let winnerDialog;

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

    if (
      this.state.disableButton &&
      this.props.isHost &&
      this.state.currentQuestionId < this.props.questions.length - 1
    ) {
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

    if (this.props.isHost && this.props.gameStarted) {
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
      );
    }

    if (this.state.currentQuestionId === this.props.questions.length - 1) {
      winnerDialog = (
        <Dialog style={{ background: "lightblue" }} fullWidth open={this.state.open} onClose={this.handleClose}>
          <DialogTitle>Game Results</DialogTitle>
          <DialogContent>
            <Typography>!!!WINNER!!!</Typography>
            <Divider />
            <Typography>{this.state.leader}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose}>Finish</Button>
          </DialogActions>
        </Dialog>
      )
    }

    if (this.state.correct) {
      waitForNext = <Typography variant="h5" color="primary">CORRECT!"</Typography>;
    } else {
      waitForNext = <Typography variant="h5" color="error">INCORRECT! Waiting for next question...</Typography>;
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
            >
              <div
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
            >
              <div
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
            >
              <div
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
        {winnerDialog}
        <Grid item xs={12} md={7}>
          <Card style={{ minHeight: "325px" }} variant="outlined">
            <CardContent>
              <Typography>
                {startButton}
                {endButton}
                {nextButton}
              </Typography>
            </CardContent>
            {this.props.gameStarted && (<Box position="relative" display="inline-flex">
              <CircularProgress variant="determinate" value={progress} />
              <Box
                top={0}
                left={0}
                bottom={0}
                right={0}
                position="absolute"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >{this.state.counter}</Box>
            </Box>)}
            {this.props.gameStarted && (
              <>
                <CardContent>
                  <Typography>
                    Question # {this.state.currentQuestionId + 1}
                  </Typography>
                  <Typography variant="h5" component="h2">
                    {question}
                  </Typography>
                </CardContent>
              </>
            )}
            {!this.props.gameStarted && !this.props.isHost && (
              <>
                <Typography variant="h4" align="center">Game starting soon...</Typography>
              </>
            )}
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
        <UserList gameId={this.props.gameId} userId={this.props.userId} setLeader={this.setLeader} />
      </Grid>
    );
  }
}
