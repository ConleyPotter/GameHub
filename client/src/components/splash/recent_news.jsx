import React from 'react';
import config from '../../config';
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(config.newsKey);

class RecentNews extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true, articles: null };
  }

  componentDidMount() {
    newsapi.v2
      .everything({
        q: 'video+games',
        language: 'en',
        sortBy: 'relevancy',
        pageSize: 5
      })
      .then(res => {
        console.log(res);
        this.setState({ loading: false, articles: res.articles });
      });
  }
  // // if (!newsResults) return null;
  // console.log(newsResults);
  // console.log('hey');
  render() {
    if (this.state.loading) return null;
    return (
      <div className='splash-news-container'>
        <div className='splash-news-results'>
          {this.state.articles.map((article, i) => {
            return (
              <a href={article.url}>
                <div className='splash-news-item'>
                  <img src={article.urlToImage} />
                  <div>{article.title}</div>
                </div>
              </a>
            );
          })}
        </div>
        <div className='attributed-text'>powered by NewsAPI.org</div>
      </div>
    );
  }
}

export default RecentNews;
