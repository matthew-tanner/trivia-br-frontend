import React from "react";
import { io } from "socket.io-client";
import "./App.css";
import Container from "@material-ui/core/Container";


import Connect from "./components/Connect";
import Header from "./components/Header";

export const socket = io(`http://localhost:3000`);

socket.on("connect", () => {
  console.log("connected", socket.id);
});

function App() {
  return (
    <div className="App">
      <Container maxWidth="sm">
        <Header />
      </Container>
    </div>
  );
}

export default App;
