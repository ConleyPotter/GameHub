import React from 'react';
import { Query } from 'react-apollo';
import { FETCH_CONSOLE_BY_URL } from '../../graphql/queries';

const ConsoleDetail = props => {
  return (
    <Query
      query={FETCH_CONSOLE_BY_URL}
      variables={{ url: props.match.params.consoleName }}
    >
      {({ loading, error, data }) => {
        console.log(data);
        if (loading) return null;
        if (error) return error.message;
        const { name, games } = data.consoleByURL;
        return (
          <div>
            <div>{name}</div>
            {games.map(game => game.name)}
          </div>
        );
      }}
    </Query>
  );
};

export default ConsoleDetail;
