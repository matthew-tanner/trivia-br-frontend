import {
  Box,
  CircularProgress,
} from "@material-ui/core/";
import React, { Component } from "react";


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

  countDown(){
    const interval = setInterval(()=> {
      const time = this.props.counter;
      if (time > 0){
        this.props.setCounter(time - 1)
      }else{
        clearInterval(interval);
      }
    }, 1000)
  }

  componentDidMount() {
    this.countDown();
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
