import React, { Component } from 'react';

class Popup extends Component {
  render() {
    return (
      <div className='popup'>
        <div className='popup_inner'>
          <h3 style={{marginTop: '2rem'}} className="ui violet header">{this.props.text}</h3>
        <button className="ui olive basic button" onClick={this.props.closePopup}>Hide Similarities</button>
        </div>
      </div>
    );
  }
}

export default Popup