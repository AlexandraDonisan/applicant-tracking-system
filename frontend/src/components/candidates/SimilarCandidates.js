import React, { Component } from 'react';
import axios from "axios";
import LoadingSpinner from "../common/LoadingSpinner";
import CandidateList from "./CandidateList";

class SimilarCandidates extends Component{
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: false, // will be true when ajax request is running
        }
    }
    componentDidMount(){
        this.fetchResponse()
    }

    fetchResponse(){
        this.setState({ loading: true }, () => {
            axios.get(`http://127.0.0.1:8000/api/candidate/get_similarities_of_one_cv_hr/${this.props.match.params.id}`)
                .then(result => {
                    console.log("Response: " + JSON.stringify(result.data));
                    this.setState({data: result.data, loading: false,})}
                )
                .catch((res) => {
                    console.log(res);
                })
        })
    }


    render() {
        const { data, loading } = this.state;
        return (
            <div>
                {loading ? <LoadingSpinner /> :
                    <div className='ui container'>
                        <h1 className="ui violet fa-bold header" style={{ marginTop: '2rem' }}>Top Most Similar CVs</h1>
                        <div className="ui inverted segment">
                            <div role="list" className="ui divided inverted relaxed list">

                                <h2 className="ui olive header">1</h2>
                                {
                                    data[0] ? data[0].map(cv =>
                                        <div role="listitem" className="item">
                                            <div className="content">
                                                <div className="header">{cv}</div>
                                            </div>
                                        </div>) : null
                                }

                                <h2 className="ui olive header">2</h2>
                                {
                                    data[1] ? data[1].map(cv =>
                                        <div role="listitem" className="item">
                                            <div className="content">
                                                <div className="header">{cv}</div>
                                            </div>
                                        </div>) : null
                                }

                                <h2 className="ui olive header">3</h2>
                                {
                                    data[2] ? data[2].map(cv =>
                                        <div role="listitem" className="item">
                                            <div className="content">
                                                <div className="header">{cv}</div>
                                            </div>
                                        </div>) : null
                                }
                            </div>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export default SimilarCandidates
