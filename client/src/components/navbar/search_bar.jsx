import React from 'react';
import { FETCH_GAMES } from '../../graphql/queries';
import { Query } from 'react-apollo';
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
			<Query query={FETCH_GAMES} variables={{ name: this.state.name, limit: 8 }}>
				{({ loading, error, data, refetch }) => {
					return (
						<div className="search-container">
							<input value={this.state.name} placeholder="Search" onChange={this.update(refetch)} />
							<div className="search-results-container">
								{this.state.name && (
									<div className="search-results">
										{data.games.map(game => {
											return (
												<Link
													to={`/games/${game._id}`}
													onClick={() => this.setState({ name: '' })}
												>
													<div className="search-result-item">
														<div className="search-result-item-image">
															<img src={game.imageURL} />
														</div>
														<div className="search-result-game-info">
															{game.name}
															<div>{`(${game.console.name})`}</div>
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
}

export default SearchBar;
