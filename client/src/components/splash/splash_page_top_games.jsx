import React from 'react';
import { Query } from 'react-apollo';
import { FETCH_TOP_GAMES_FOR_CONSOLES } from '../../graphql/queries';
import TopRatedGames from '../consoles/top_rated_games';

class SplashTopGames extends React.Component {
	constructor(props) {
		super(props);
		this.state = { name: 'Nintendo Switch' };
	}

	render() {
		let ps4, ninSwitch, pc, xbox;
		switch (this.state.name) {
			case 'Nintendo Switch':
				ninSwitch = 'selected';
				break;
			case 'PlayStation 4':
				ps4 = 'selected';
				break;
			case 'PC':
				pc = 'selected';
				break;
			case 'XBox One':
				xbox = 'selected';
				break;
			default:
				break;
		}
		return (
			<Query query={FETCH_TOP_GAMES_FOR_CONSOLES}>
				{({ loading, error, data }) => {
					if (error) console.log(error);
					if (!data.consoles) return null;
					let topGames = data.consoles.filter(console => console.name === this.state.name)[0].topGames;
					return (
						<div className="splash-top-games-container">
							<div className="splash-top-games-header">Top Games on GameHub</div>
							<div className="console-selector-buttons">
								<button onClick={() => this.setState({ name: 'PlayStation 4' })} className={ps4}>
									PS4
								</button>
								<button
									onClick={() => this.setState({ name: 'Nintendo Switch' })}
									className={ninSwitch}
								>
									Switch
								</button>
								<button onClick={() => this.setState({ name: 'XBox One' })} className={xbox}>
									XBox One
								</button>
								<button onClick={() => this.setState({ name: 'PC' })} className={pc}>
									PC
								</button>
							</div>
							<TopRatedGames games={topGames} />
						</div>
					);
				}}
			</Query>
		);
	}
}

export default SplashTopGames;
