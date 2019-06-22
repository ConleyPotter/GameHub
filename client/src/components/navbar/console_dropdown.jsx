import React from 'react';
import { Link } from 'react-router-dom';

const ConsoleDropdown = () => {
  return (
    <div className='console-dropdown-list'>
      <ul>
        <div className='console-dropdown-item'>
          <Link to='/pc'>
            {/* <img
              src='https://www.pinclipart.com/picdir/middle/385-3850022_computer-pc-clipart-vector-computer-pc-logo-png.png'
              className='dropdown-console-logo'
            /> */}
            <i className='fas fa-desktop' />
            <li>PC</li>
          </Link>
        </div>
        <div className='console-dropdown-item'>
          <Link to='/ps4'>
            {/* <img
              src='https://seeklogo.com/images/S/sony-playstation-logo-35A4C2E414-seeklogo.com.png'
              className='dropdown-console-logo'
            /> */}
            <i className='fab fa-playstation' />
            <li>PlayStation 4</li>
          </Link>
        </div>
        <div className='console-dropdown-item'>
          <Link to='/xboxone'>
            {/* <img
              src='https://www.freepnglogos.com/uploads/xbox-games-logo-symbol-19.png'
              className='dropdown-console-logo xbox'
            /> */}
            <i className='fab fa-xbox' />
            <li>XBox One</li>
          </Link>
        </div>
        <div className='console-dropdown-item'>
          <Link to='/switch'>
            {/* <img
              src='https://banner2.kisspng.com/20180529/pga/kisspng-nintendo-switch-logo-video-game-consoles-mario-background-5b0dd684177033.090291771527633540096.jpg'
              className='dropdown-console-logo'
            /> */}
            <i className='fas fa-heart' />
            <li>Switch</li>
          </Link>
        </div>
      </ul>
    </div>
  );
};

export default ConsoleDropdown;
