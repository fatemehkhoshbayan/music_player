import React, { Component } from "react";
import { render } from "react-dom";
import CreateRoomPage from "./CreateRoomPage";
import RoomJoinPage from "./RoomJoinPage";
import {
    BrowserRouter as Router, 
    Switch, 
    Link, 
    Route, 
    Redirect 
} from "react-router-dom";


export default class HomePage extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/">
                        <p>This is a home page!</p>
                    </Route>
                    <Route path="/join" component={RoomJoinPage} />
                    <Route path='/create' component={CreateRoomPage} />
                </Switch>
            </Router>
        );
    }
}
