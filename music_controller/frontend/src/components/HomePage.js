import React, { useState, useEffect } from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Info from "./info";

import Room from "./Room";
import { Grid, Button, ButtonGroup, Typography } from "@material-ui/core";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";

export default function HomePage(props) {
  const [roomCode, setRoomCode] = useState(null);

  useEffect(() => {
    async function getRoomCode() {
      fetch("/api/user-in-room")
        .then((response) => response.json())
        .then((data) => {
          setRoomCode(data.code);
        });
    }
    getRoomCode;
  });

  function renderHomePage() {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} align="center">
          <Typography variant="h3" compact="h3">
            House Party
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <ButtonGroup disableElevation variant="contained" color="primary">
            <Button color="primary" to="/join" component={Link}>
              Join a Room
            </Button>
            <Button color="default" to="/info" component={Link}>
              Info
            </Button>
            <Button color="secondary" to="/create" component={Link}>
              Create a Room
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    );
  }

  function clearRoomCode() {
    setRoomCode(null);
  }

  return (
    <Router>
      <Routes>
        <Route
          exact
          path="/"
          element={
            roomCode ? <Navigate replace to={`/room/${roomCode}`} /> : renderHomePage()
          }
        />
        <Route path="/join" element={<RoomJoinPage />} />
        <Route path="/info" element={<Info />} />
        <Route path="/create" element={<CreateRoomPage />} />
        <Route
          path="/room/:roomCode"  
          element = {<Room {...props} leaveRoomCallback={clearRoomCode} />}
        />
      </Routes>
    </Router>
  );
}
