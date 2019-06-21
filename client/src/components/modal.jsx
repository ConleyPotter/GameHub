import React from 'react';
import SignupForm from './forms/session/signup';
import LoginForm from './forms/session/login';
import './modal.css';

const Modal = ({ type, closeModal }) => {
  let form;
  switch (type) {
    case 'signup':
      form = <SignupForm />;
      break;
    case 'login':
      form = <LoginForm />;
      break;
    default:
      return null;
  }
  return (
    <div className='modal-container'>
      <button onClick={() => closeModal()}>Close</button>
      <div className='modal-content'>{form}</div>
    </div>
  );
};

export default Modal;
