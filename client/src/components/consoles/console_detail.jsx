import React from 'react';
import { Query } from 'react-apollo';
import { FETCH_CONSOLE_BY_URL, 
  IS_LOGGED_IN, 
  FETCH_CURRENT_USER_SURVEY 
} from '../../graphql/queries';
import { Link } from 'react-router-dom';
import TopRatedGames from './top_rated_games';
import UpcomingGames from './upcoming_games';
import SurveyForm from '../forms/surveys/SurveyForm';
import './console_detail.scss';

const ConsoleDetail = props => {
  return (
    <Query
      query={FETCH_CONSOLE_BY_URL}
      variables={{ url: props.match.params.consoleName }}
    >
      {({ loading, error, data }) => {
        if (loading) return 'Loading...';
        if (error) return error.message;
        let consoleId = data.consoleByURL._id
        const { name, imageURL, topGames, upcomingGames } = data.consoleByURL;
        return (
          <div className='console-detail-container'>
            <div className='console-detail-header'>
              <div className='console-detail-hero-image'>
                <img src={imageURL} alt={`${name} photo`} />
                {name}
              </div>
            </div>
            <div className='console-detail-game-lists'>
              <TopRatedGames games={topGames} />
              <UpcomingGames games={upcomingGames} />
              <div className="survey">
                <Query query={IS_LOGGED_IN}>
                  {({ data }) => {
                    let currentUserId = data.currentUserId ? data.currentUserId : '';
                    return (
                      <Query
                        query={FETCH_CURRENT_USER_SURVEY}
                        variables={{
                          consoleId: consoleId,
                          userId: currentUserId
                        }}
                      >
                        {({ loading, error, data }) => {
                          if (loading) return 'Loading Survey Form...';
                          if (error) return `Error! ${error.message}`;
                          console.log(data);
                          let consoleId = '';
                          let favoriteGameOf2019 = '';
                          let favoriteGameOf2018 = '';
                          let mostAnticipatedGame = '';
                          let previousSurvey = false;
                          let surveyId = '';
                          if (data.currentUserSurvey && data.currentUserSurvey.user) {
                            previousSurvey = true;
                            surveyId = data.currentUserSurvey._id;
                            consoleId = consoleId;
                            favoriteGameOf2019 = data.currentUserSurvey.favoriteGameOf2019;
                            favoriteGameOf2018 = data.currentUserSurvey.favoriteGameOf2018;
                            mostAnticipatedGame = data.currentUserSurvey.mostAnticipatedGame;
                          }
                          return (
                            <SurveyForm
                              consoleId={consoleId}
                              user={currentUserId}
                              surveyId={surveyId}
                              previousSurvey={previousSurvey}
                              favoriteGameOf2019={favoriteGameOf2019}
                              favoriteGameOf2018={favoriteGameOf2018}
                              mostAnticipatedGame={mostAnticipatedGame}
                              topGames={topGames}
                            />
                          );
                        }}
                      </Query>
                    )
                  }}
                </Query>
              </div>
            </div>
          </div>
        );
      }}
    </Query>
  );
};

export default ConsoleDetail;
