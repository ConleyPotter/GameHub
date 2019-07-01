import React from 'react';
import { Link } from 'react-router-dom';

export default function ListIndex({ lists }) {
	const listLis = lists.map(list => {
		const gameLis = list.games.map(game => {
			return (
				<li className="list-game-li">
					<Link to={`/games/${game._id}`} className="list-game-link">
						<img
							className="avatar"
							src={`${game.imageURL ||
								'https://ryanacademy.ie/wp-content/uploads/2017/04/user-placeholder.png'}`}
							alt={`${game.imageURL} avatar`}
						/>
						<h5 className="game-name">{game.name}</h5>
						<p className="console-name">({game.console.name})</p>
					</Link>
				</li>
			);
		});
		return (
			<li className="list-li">
				<h3 className="list-name">{list.name}</h3>
				<ul className="list-game-ul">{gameLis}</ul>
			</li>
		);
	});
	const listDisplay = listLis.length > 0 ? <ul>{listLis}</ul> : <p>There don't seem to be any lists yet.</p>;
	return (
		<div>
			<h3>User Lists</h3>
			<button
				onClick={e => {
					e.preventDefault();
				}}
			>
				Create New List
			</button>
			{listDisplay}
		</div>
	);
}
