import React from 'react';
import { withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import { merge } from 'lodash';
import {
  FETCH_CURRENT_USER_SURVEY, 
  FETCH_CONSOLE_BY_URL 
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
      surveyId: this.props.surveyId
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
        variables:  { userId: this.state.user, consoleId: this.state.consoleId }
      });
    } catch (err) {
      return;
    }
    const newCachedSurvey = merge(survey, data.newSurvey);
    cache.writeQuery({
      query: FETCH_CURRENT_USER_SURVEY,
      data: { currentUserSurvey: newCachedSurvey }
    });
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
              <label>What is your favorite game of the games below?</label>
              <input type="radio" name="favoriteGameOf2019" value="Game1"/>
              <input type="radio" name="favoriteGameOf2019" value="Game2"/>
              <input type="radio" name="favoriteGameOf2019" value="Game3"/>
              <button type="submit">
                Submit Survey
              </button>
            </form>
          </div>
        )}
      </Mutation>
    );
  }
}

export default withRouter(SurveyForm);
