import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@material-ui/core/";
import React, { Component } from "react";
import { socket } from "../App";


interface CounterState {

}
interface CounterProps {
  setDisableButton(): void;
  counter: number;
  setCounter(i: number): void;
}
export class Counter extends Component<CounterProps, CounterState> {
  constructor(props: CounterProps) {
    super(props);
    this.state = {
    };

  }


  componentDidMount() {
    socket.on("counter", (data) => {
      if (data === 0) {
        this.props.setDisableButton();
        this.props.setCounter(data);
      } else {
        this.props.setCounter(data);
      }
    })
  }

  render() {
    const progress = (this.props.counter * 100) / 15
    return (
      <Box position="relative" display="inline-flex">
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
      >{this.props.counter}</Box>
      </Box>
    );
  }
}
