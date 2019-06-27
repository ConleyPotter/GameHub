import React from 'react';
import { describeArc } from '../../services/svg';
import './game_rating.scss';

export default ({ boxWidth, strokeWidth, rating }) => {
	// A rating of 0-50 will result in a pure red {rgb(256,0,0)}
	// A rating of 100 will result in a pure green {rgb(0,256,0)}
	// Ratings between 50 and 100 will calculate color between these values
	const ratingColor =
		'rgb(' + (200 - 2 * Math.max(50, rating)) * 2.56 + ',' + (2 * Math.max(50, rating) - 100) * 2.56 + ',0)';

	//Creates an array of small strokes to simulate a gradient for rating colors
	const colorIndicators = [...Array(100)].reverse().map((_, i) => (
		<path
			key={i}
			d={describeArc({
				centerX: boxWidth / 2,
				centerY: boxWidth / 2,
				radius: (boxWidth - strokeWidth) / 2 - 4,
				startAngle: 180 * (i / 100),
				endAngle: 180 * (i / 100) + 2
			})}
			fill="none"
			stroke={'rgb(' + (200 - 2 * Math.max(50, i)) * 2.56 + ',' + (2 * Math.max(50, i) - 100) * 2.56 + ',0)'}
			strokeWidth={strokeWidth}
		/>
	));
	return (
		<div className="rating-meter">
			<svg viewBox={`0 0 ${boxWidth} ${boxWidth / 2}`} className="rating-meter-viewBox">
				{colorIndicators}
				<path
					d={describeArc({
						centerX: boxWidth / 2,
						centerY: boxWidth / 2,
						radius: (boxWidth - strokeWidth) / 2,
						startAngle: 0,
						endAngle: 180
					})}
					fill="none"
					stroke="white"
					strokeWidth={strokeWidth}
				/>
				<path
					className="rating-arc"
					d={describeArc({
						centerX: boxWidth / 2,
						centerY: boxWidth / 2,
						radius: (boxWidth - strokeWidth) / 2,
						startAngle: 0,
						endAngle: 180 * rating / 100
					})}
					fill="none"
					stroke={ratingColor}
					strokeWidth={strokeWidth}
				/>
			</svg>
			<p className="rating-meter-value" style={{ color: ratingColor }}>
				{rating}
			</p>
		</div>
	);
};
