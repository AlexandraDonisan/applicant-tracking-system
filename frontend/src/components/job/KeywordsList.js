import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getKeywords, getJobs, deleteKeyword } from '../../actions/keywords';

class KeywordsList extends Component {
    componentDidMount() {
        this.props.getKeywords();
    }

    render() {
        return (
            <div className='ui relaxed divided list' style={{ marginTop: '2rem' }}>
                <h1>Keywords</h1>
                {this.props.keywords.map(keyword => (
                    <div className='item' key={keyword.id}>
                        <div className='right floated content'>
                            <Link to={`/delete/keyword/${keyword.id}`} className='small ui  red button'>Delete</Link>
                        </div>
                        <div className='right floated content'>
                            <Link to={`/edit/keyword/${keyword.id}`} className='small ui olive button'>Edit</Link>
                        </div>
                        <i className='large calendar outline middle aligned icon' />
                        <div className='content'>
                            <a className='header'>{keyword.word}</a>
                            <div className='description'>{keyword.weight}</div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    keywords: Object.values(state.keywords)
});

export default connect(
    mapStateToProps,
    { getKeywords, deleteKeyword }
)(KeywordsList);