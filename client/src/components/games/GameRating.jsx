import React from 'react';
import { describeArc } from '../../services/svg';
import './game_rating.scss';

export default ({ rating }) => {
	// A rating of 0-50 will result in a pure red {rgb(256,0,0)}
	// A rating of 100 will result in a pure green {rgb(0,256,0)}
	// Ratings between 50 and 100 will calculate color between these values
	const ratingColor = function(r) {
		return 'rgb(' + (200 - 2 * Math.max(50, r)) * 2.56 + ',' + (2 * Math.max(50, r) - 100) * 2.56 + ',0)';
	};

	//Creates an array of small strokes to simulate a gradient for rating colors
	const colorIndicators = [...Array(100)].reverse().map((_, i) => (
		<path
			key={i}
			d={describeArc({
				centerX: 50,
				centerY: 50,
				radius: 33,
				startAngle: 180 * (i / 100),
				endAngle: 180 * (i / 100) + 2
			})}
			fill="none"
			stroke={ratingColor(i)}
			strokeWidth={25}
		/>
	));
	return (
		<div className="rating-meter">
			<svg viewBox="0 0 100 50" className="rating-meter-viewBox">
				{colorIndicators}
				<path
					d={describeArc({
						centerX: 50,
						centerY: 50,
						radius: 37,
						startAngle: 0,
						endAngle: 180
					})}
					fill="none"
					stroke="white"
					strokeWidth={25}
				/>
				<path
					className="rating-arc"
					d={describeArc({
						centerX: 50,
						centerY: 50,
						radius: 37,
						startAngle: 0,
						endAngle: 180 * rating / 100
					})}
					fill="none"
					stroke={ratingColor(rating)}
					strokeWidth={25}
				/>
			</svg>
			<p className="rating-meter-value" style={{ color: ratingColor(rating) }}>
				{rating}
			</p>
		</div>
	);
};
