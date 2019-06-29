import React from 'react';
import { Mutation, Query } from 'react-apollo';
import { ADD_GAME } from '../../graphql/mutations';
import { FETCH_CONSOLES } from '../../graphql/queries';
import { withRouter } from 'react-router-dom';
import './add_game_form.scss';

class AddGameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      consoleId: null,
      description: '',
      releaseDate: '',
      imageURL: '',
      videoUrl: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  update(field) {
    return e => this.setState({ [field]: e.target.value });
  }

  handleSubmit(e, newGame) {
    e.preventDefault();
    const {
      name,
      consoleId,
      description,
      releaseDate,
      imageURL,
      videoUrl
    } = this.state;
    let date = new Date(releaseDate);
    date = date
      .toDateString()
      .split(' ')
      .slice(1)
      .join(' ');
    newGame({
      variables: {
        name,
        console: this.state.consoleId,
        description,
        releaseDate: date,
        imageURL,
        videoUrl
      }
    }).then(data => {
      // console.log(data);
      this.props.history.push(`/games/${data.data.newGame._id}`);
    });
  }

  render() {
    return (
      <Query query={FETCH_CONSOLES}>
        {({ loading, error, data }) => {
          if (loading) return null;
          const { consoles } = data;
          return (
            <Mutation
              mutation={ADD_GAME}
              // update={(cache, data) => this.updateCache(cache, data)}
            >
              {newGame => (
                <div className='new-game-form-container'>
                  <form
                    className='new-game-form'
                    onSubmit={e => this.handleSubmit(e, newGame)}
                  >
                    <input placeholder='title' onChange={this.update('name')} />
                    <textarea
                      placeholder='description'
                      onChange={this.update('description')}
                    />
                    <div className='console-select'>
                      <select onChange={this.update('consoleId')}>
                        <option selected disabled>
                          select a console
                        </option>
                        {consoles.map(consoleItem => {
                          return (
                            <option value={consoleItem._id}>
                              {consoleItem.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div className='release-date-select'>
                      <label>Release Date:</label>
                      <input
                        type='date'
                        onChange={this.update('releaseDate')}
                      />
                    </div>
                    <input
                      placeholder='image url'
                      onChange={this.update('imageURL')}
                    />
                    <input
                      placeholder='game trailer url'
                      onChange={this.update('videoUrl')}
                    />
                    <button type='submit'>Add Game</button>
                  </form>
                </div>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

export default withRouter(AddGameForm);
