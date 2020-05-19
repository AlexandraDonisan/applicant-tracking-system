import React from 'react';
import ReactDOM from 'react-dom';

// To render the Modal component outside the DOM hierarchy of the parent component, create a portal using createPortal().
// The first argument is the renderable child element and the second argument is the DOM element to render
const Modal = props => {
  return ReactDOM.createPortal(
    <div onClick={props.onDismiss} className='ui active dimmer'>
      <div onClick={e => e.stopPropagation()} className='ui active modal'>
        <div className='header'>{props.title}</div>
        <div className='content'>{props.content}</div>
        <div className='actions'>{props.actions}</div>
      </div>
    </div>,
    document.querySelector('#modal')
  );
};

export default Modal;