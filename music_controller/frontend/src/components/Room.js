import React, { useState, useEffect, Component, useCallback } from "react";
import { Grid, Button, Typography } from "@material-ui/core";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";
import { useHistory, useParams } from "react-router-dom";

export default function Room(props) {
  const { roomCode } = useParams();
  const [votesToSkip, setVotesToSkip] = useState(2);
  const [guestCanPause, setGuestCanPause] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
  const [song, setSong] = useState({});
  getRoomDetails();

  const history = useHistory();

  useEffect(() => {
    getCurrentSong();
    const interval = setInterval(() => {
      getCurrentSong();
    },  20000);
    return () => clearInterval(interval);
  }, [getCurrentSong]);

  async function getRoomDetails() {
    return fetch("/api/get-room" + "?code=" + roomCode)
      .then((response) => {
        if (!response.ok) {
          props.leaveRoomCallback();
          history.push("/");
        }
        return response.json();
      })
      .then((data) => {
        setGuestCanPause(data.guest_can_pause);
        setVotesToSkip(data.votes_to_skip);
        setIsHost(data.is_host);
        if (isHost) {
          authenticateSpotify();
        }
      });
  }

  function authenticateSpotify() {
    fetch("/spotify/is-authenticated")
      .then((response) => response.json())
      .then((data) => {
        setSpotifyAuthenticated(data.status);
        if (!data.status) {
          fetch("/spotify/get-auth-url")
            .then((response) => response.json())
            .then((data) => {
              window.location.replace(data.url);
            });
        }
      });
  }

  function getCurrentSong() {
    fetch("/spotify/current-song")
      .then((response) => {
        if (!response.ok) {
          return {};
        } else {
          return response.json();
        }
      })
      .then((data) => {
        setSong(data);
        console.log(data);
      });
  }

  function leaveButtonPressed() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/leave-room", requestOptions).then((_response) => {
      props.leaveRoomCallback();
      history.push("/");
    });
  }

  function updateShowSetthings(value) {
    setShowSettings(value);
  }

  function renderSettings() {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <CreateRoomPage
            update={true}
            votesToSkip={votesToSkip}
            guestCanPause={guestCanPause}
            roomCode={roomCode}
            updateCallback={getRoomDetails}
          />
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            color="secondary"
            variant="contained"
            onClick={() => updateShowSetthings(false)}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    );
  }

  function renderSettingsButton() {
    return (
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => updateShowSetthings(true)}
        >
          Settings
        </Button>
      </Grid>
    );
  }

  if (showSettings) {
    return renderSettings();
  }
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          Code: {roomCode}
        </Typography>
      </Grid>
      <MusicPlayer {...song} />
      {isHost ? renderSettingsButton() : null}
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="secondary"
          onClick={leaveButtonPressed}
        >
          Leave Room
        </Button>
      </Grid>
    </Grid>
  );
}

// export default class Room extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       votesToSkip: 2,
//       guestCanPause: false,
//       isHost: false,
//       showSettings: false,
//       spotifyAuthenticated: false,
//       song: {},
//     };
//     this.roomCode = this.props.match.params.roomCode;
//     this.leaveButtonPressed = this.leaveButtonPressed.bind(this);
//     this.updateShowSetthings = this.updateShowSetthings.bind(this);
//     this.renderSettings = this.renderSettings.bind(this);
//     this.renderSettingsButton = this.renderSettingsButton.bind(this);
//     this.getRoomDetails = this.getRoomDetails.bind(this);
//     this.authenticateSpotify = this.authenticateSpotify.bind(this);
//     this.getCurrentSong = this.getCurrentSong.bind(this);
//     this.getRoomDetails();
//   }

//   componentDidMount() {
//     this.interval = setInterval(this.getCurrentSong, 1000);
//   }

//   componentWillUnmount() {
//     clearInterval(this.interval);
//   }

//   getRoomDetails() {
//     return fetch("/api/get-room" + "?code=" + this.roomCode)
//       .then((response) => {
//         if (!response.ok) {
//           this.props.leaveRoomCallback();
//           this.props.history.push("/");
//         }
//         return response.json();
//       })
//       .then((data) => {
//         this.setState({
//           votesToSkip: data.votes_to_skip,
//           guestCanPause: data.guest_can_pause,
//           isHost: data.is_host,
//         });
//         if (this.state.isHost) {
//           this.authenticateSpotify();
//         }
//       });
//   }

//   authenticateSpotify() {
//     fetch("/spotify/is-authenticated")
//       .then((response) => response.json())
//       .then((data) => {
//         this.setState({ spotifyAuthenticated: data.status });
//         if (!data.status) {
//           fetch("/spotify/get-auth-url")
//             .then((response) => response.json())
//             .then((data) => {
//               window.location.replace(data.url);
//             });
//         }
//       });
//   }

//   getCurrentSong() {
//     fetch("/spotify/current-song")
//       .then((response) => {
//         if (!response.ok) {
//           return {};
//         } else {
//           return response.json();
//         }
//       })
//       .then((data) => {
//         this.setState({ song: data });
//         console.log(data);
//       });
//   }

//   leaveButtonPressed() {
//     const requestOptions = {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//     };
//     fetch("/api/leave-room", requestOptions).then((_response) => {
//       this.props.leaveRoomCallback();
//       this.props.history.push("/");
//     });
//   }

//   updateShowSetthings(value) {
//     this.setState({
//       showSettings: value,
//     });
//   }

//   renderSettings() {
//     return (
//       <Grid container spacing={1}>
//         <Grid item xs={12} align="center">
//           <CreateRoomPage
//             update={true}
//             votesToSkip={this.state.votesToSkip}
//             guestCanPause={this.state.guestCanPause}
//             roomCode={this.roomCode}
//             updateCallback={this.getRoomDetails}
//           />
//         </Grid>
//         <Grid item xs={12} align="center">
//           <Button
//             color="secondary"
//             variant="contained"
//             onClick={() => this.updateShowSetthings(false)}
//           >
//             Close
//           </Button>
//         </Grid>
//       </Grid>
//     );
//   }

//   renderSettingsButton() {
//     return (
//       <Grid item xs={12} align="center">
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={() => this.updateShowSetthings(true)}
//         >
//           Settings
//         </Button>
//       </Grid>
//     );
//   }

//   render() {
//     if (this.state.showSettings) {
//       return this.renderSettings();
//     }
//     return (
//       <Grid container spacing={1}>
//         <Grid item xs={12} align="center">
//           <Typography variant="h4" component="h4">
//             Code: {this.roomCode}
//           </Typography>
//         </Grid>
//         <MusicPlayer {...this.state.song} />
//         {this.state.isHost ? this.renderSettingsButton() : null}
//         <Grid item xs={12} align="center">
//           <Button
//             variant="contained"
//             color="secondary"
//             onClick={this.leaveButtonPressed}
//           >
//             Leave Room
//           </Button>
//         </Grid>
//       </Grid>
//     );
//   }
// }
