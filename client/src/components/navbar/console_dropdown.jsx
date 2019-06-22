import React from 'react';
import { Query } from 'react-apollo';
import { FETCH_CONSOLES } from '../../graphql/queries';

const ConsoleDropdown = () => {
  return (
    <div className='console-dropdown-list'>
      <ul>
        <li>PC</li>
        <li>PlayStation 4</li>
        <li>Xbox One</li>
        <li>Nintendo Switch</li>
      </ul>
    </div>
  );
};

export default ConsoleDropdown;
