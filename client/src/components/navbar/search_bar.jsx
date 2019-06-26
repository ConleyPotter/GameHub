import React from 'react';
import { FETCH_GAMES } from '../../graphql/queries';
import { Query, ApolloConsumer } from 'react-apollo';
import { Link } from 'react-router-dom';
import './search_bar.scss';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: '' };
    this.update = this.update.bind(this);
  }

  update(refetch) {
    return e => {
      this.setState({ name: e.target.value });
      refetch();
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
              <div className='search-results-container'>
                {this.state.name && (
                  <div className='search-results'>
                    {data.games.map(game => {
                      return (
                        <Link
                          to={`/games/${game._id}`}
                          onClick={() => this.setState({ name: '' })}
                        >
                          <div className='search-result-item'>
                            <div className='search-result-item-image'>
                              <img src={game.imageURL} />
                            </div>
                            <div className='search-result-game-info'>
                              {game.name}
                              {/* <div>{`(${game.console.name})`}</div> */}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        }}
      </Query>
    );
  }
  // update(e, client) {
  //   return client
  //     .query({
  //       query: FETCH_GAMES,
  //       variables: { name: this.state.name }
  //     })
  //     .then(data => this.setState({ name: e.target.value, games: data.games }));
  // }

  // render() {
  //   return (
  //     <ApolloConsumer>
  //       {client => (
  //         <div className='search-container'>
  //           <input
  //             value={this.state.name}
  //             placeholder='Search'
  //             onChange={this.update(client)}
  //           />
  //           <div className='search-results'>
  //             //{' '}
  //             {this.state.games &&
  //               this.state.games.map(game => {
  //                 return <div>{game.name}</div>;
  //               })}
  //           </div>
  //         </div>
  //       )}
  //     </ApolloConsumer>
  //   );
  // }
}

export default SearchBar;
