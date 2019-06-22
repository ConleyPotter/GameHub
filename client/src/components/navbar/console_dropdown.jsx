import React from 'react';
import { Query } from 'react-apollo';
import { FETCH_CONSOLES } from '../../graphql/queries';
import { Link } from 'react-router-dom';

const ConsoleDropdown = () => {
  return (
    <div className='console-dropdown-list'>
      <ul>
        <Link to='/pc'>
          <li>PC</li>
        </Link>
        <Link to='/ps4'>
          <li>PlayStation 4</li>
        </Link>
        <Link to='/xboxone'>
          <li>XBox One</li>
        </Link>
        <Link to='/switch'>
          <li>Switch</li>
        </Link>
      </ul>
    </div>
  );
};

export default ConsoleDropdown;
