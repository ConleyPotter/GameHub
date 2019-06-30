import React from 'react';
import SignupForm from './forms/session/signup';
import LoginForm from './forms/session/login';
import AddGameForm from './admin/add_game_form';
import './modal.scss';

const Modal = ({ type, closeModal }) => {
  let form;
  switch (type) {
    case 'signup':
      form = <SignupForm closeModal={closeModal} />;
      break;
    case 'login':
      form = <LoginForm closeModal={closeModal} />;
      break;
    case 'addGame':
      form = <AddGameForm closeModal={closeModal} />;
      break;
    default:
      return null;
  }

  let handleClose = e => {
    if (e.target.classList[0] === 'modal-container') {
      closeModal();
    }
  };
  return (
    <div className='modal-container' onClick={handleClose}>
      {/* <button onClick={() => closeModal()}>Close</button> */}

      <div className='modal-content'>
        <span className='modal-close' onClick={() => closeModal()}>
          <i className='fas fa-times' />
        </span>
        {form}
      </div>
    </div>
  );
};

export default Modal;
