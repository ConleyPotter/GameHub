import React from 'react';
import { FETCH_GAMES } from '../../graphql/queries';
import { Query, ApolloConsumer } from 'react-apollo';
import './search_bar.scss';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: '' };
  }

  update() {
    return e => {
      this.setState({ name: e.target.value });
    };
  }

  render() {
    return (
      <Query query={FETCH_GAMES} variables={{ name: this.state.name }}>
        {({ loading, error, data, refetch }) => {
          console.log(data);
          return (
            <div className='search-container'>
              <input
                value={this.state.name}
                placeholder='Search'
                onChange={this.update(refetch)}
              />
              <div className='search-results'>
                {this.state.name &&
                  data.games.map(game => {
                    return <div>{game.name}</div>;
                  })}
              </div>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default SearchBar;
