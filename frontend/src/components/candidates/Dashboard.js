import React, { Component } from 'react';
import CandidateList from "./CandidateList";
import CandidateCreate from "./CandidateCreate";
import {Link} from "react-router-dom";

class Dashboard extends Component {
    render() {
        return (
            <div className='ui container'>
                <div className='right floated fixed'>
                    <div className="ui animated button" tabIndex="0" onChange={console.log("Button Pressed on Visible ")}>
                        <div className="visible content" >Compute Scores</div>
                        <div className="hidden content" onClick={console.log("Button Pressed on Hidden")}>
                            <i className="file alternate outline icon"></i>
                        </div>
                    </div>
                </div>
                <CandidateList />
            </div>
        );
    }
}

export default Dashboard;