import React from 'react';
import { withRouter } from 'react-router-dom';
import { Mutation, Query } from 'react-apollo';
import { merge } from 'lodash';
import {
  FETCH_CURRENT_USER_SURVEY,
  FETCH_GAME
} from '../../../graphql/queries';
import { CREATE_SURVEY } from '../../../graphql/mutations';

class SurveyForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      consoleId: this.props.consoleId,
      user: this.props.user,
      favoriteGameOf2019: this.props.favoriteGameOf2019,
      favoriteGameOf2018: this.props.favoriteGameOf2018,
      mostAnticipatedGame: this.props.mostAnticipatedGame,
      surveyId: this.props.surveyId,
      games2019: {
        game1: { id: "5d0d854bb6910b5c70a96e15" },
        game2: { id: "5d0e5b113e1d7f5ff9165c30" },
        game3: { id: "5d118bac89086375e27ce8c5" },
        game4: { id: "5d118c5b89086375e27ce8c6" }
      },
      games2018: {
        game1: { id: "5d14e54dfd36a04d7d7c480d" },
        game2: { id: "5d14e48ffd36a04d7d7c480c" },
        game3: { id: "5d0e911f1c9d4400000fb9c1" },
        game4: { id: "5d14e54dfd36a04d7d7c480d" }
      },
      upcomingGames: {
        game1: {},
        game2: {},
        game3: {},
        game4: {}
      }
    };
  }

  componentDidMount() {
    for(let i = 0; i < 4; i++) {
      // let game2019Id = this.state.games2019[i]._id;

    }
  }

  componentDidUpdate(prevProps) {
    // if (
    //   prevProps.match.params.consoleId !== this.props.match.params.consoleId ||
    //   prevProps.currentUserId !== this.props.currentUserId
    // ) {
    //   this.setState({
    //     consoleId: this.props.consoleId,
    //     user: this.props.user,
    //     favoriteGameOf2019: this.props.favoriteGameOf2019,
    //     favoriteGameOf2018: this.props.favoriteGameOf2018,
    //     surveyId: this.props.surveyId
    //   });
    // }
  }

  update(field) {
    return e => this.setState({ [field]: e.target.value });
  }

  updateCache(cache, { data }) {
    let survey;
    try {
      survey = cache.readQuery({
        query: FETCH_CURRENT_USER_SURVEY,
        variables: { userId: this.state.user, consoleId: this.state.consoleId }
      });
    } catch (err) {
      return;
    }
    if (survey) {
      const newCachedSurvey = merge(survey, data.newSurvey);
      cache.writeQuery({
        query: FETCH_CURRENT_USER_SURVEY,
        data: { currentUserSurvey: newCachedSurvey }
      });
    }
  }

  handleSubmit(e, submitSurvey) {
    e.preventDefault();
    submitSurvey({
      variables: {
        _id: this.state.surveyId,
        consoleId: this.state.consoleId,
        user: this.state.user,
        favoriteGameOf2019: this.state.favoriteGameOf2019,
        favoriteGameOf2018: this.state.favoriteGameOf2018,
        mostAnticipatedGame: this.state.mostAnticipatedGame
      }
    });
  }

  render() {
    return (
      <Mutation
        mutation={CREATE_SURVEY}
        onError={err => this.setState({ message: err.message })}
        update={(cache, data) => this.updateCache(cache, data)}
      >
        {(submitSurvey, { data }) => (
          <div className="survey-form-container">
            <h3>Leave a Survey Response</h3>
            <form onSubmit={e => this.handleSubmit(e, submitSurvey)}>
              <label>
                What is your favorite game of the games below from 2019?
              </label>
              <br />
              <Query
                query={FETCH_GAME}
                variables={{ id: this.state.games2019.game1.id }}
              >
                {({ data, loading }) => {
                  return (
                    <div>
                      <input
                        type="radio"
                        name="favoriteGameOf2019"
                        value="Game1"
                      />
                      {loading ? null : data.game.name}
                    </div>
                  );
                }}
              </Query>
              <br />
              <Query
                query={FETCH_GAME}
                variables={{ id: this.state.games2019.game2.id }}
              >
                {({ data, loading }) => {
                  return (
                    <div>
                      <input
                        type="radio"
                        name="favoriteGameOf2019"
                        value="Game2"
                      />
                      {loading ? null : data.game.name}
                    </div>
                  );
                }}
              </Query>
              <br />
              <Query
                query={FETCH_GAME}
                variables={{ id: this.state.games2019.game3.id }}
              >
                {({ data, loading }) => {
                  return (
                    <div>
                      <input
                        type="radio"
                        name="favoriteGameOf2019"
                        value="Game3"
                      />
                      {loading ? null : data.game.name}
                    </div>
                  );
                }}
              </Query>
              <label>
                What is your favorite game of the games below from 2018?
              </label>
              <br />
              <input type="radio" name="favoriteGameOf2019" value="Game1" />
              Game 1 <br />
              <input type="radio" name="favoriteGameOf2019" value="Game2" />
              Game 2 <br />
              <input type="radio" name="favoriteGameOf2019" value="Game3" />
              Game 3 <br />
              <label>
                What game are you most looking forward to coming out?
              </label>
              <br />
              <input type="radio" name="favoriteGameOf2019" value="Game1" />
              Game 1 <br />
              <input type="radio" name="favoriteGameOf2019" value="Game2" />
              Game 2 <br />
              <input type="radio" name="favoriteGameOf2019" value="Game3" />
              Game 3 <br />
              <button type="submit">Submit Survey</button>
            </form>
          </div>
        )}
      </Mutation>
    );
  }
}

export default withRouter(SurveyForm);
