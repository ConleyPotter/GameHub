export function formatDate(dateInt) {
	const reviewDateObject = new Date(parseInt(dateInt));
	const reviewDateString = reviewDateObject.toDateString();
	const reviewTimeString = reviewDateObject.toLocaleTimeString();
	const formattedReviewTime = reviewTimeString
		.split(' ')[0]
		.split(':')
		.slice(0, 2)
		.join(':')
		.concat(reviewTimeString.split(' ')[1].toLowerCase());
	const reviewDateParts = reviewDateString.split(' ');
	const formattedReviewDate = reviewDateParts[0].concat(
		', ',
		reviewDateParts[1],
		' ',
		reviewDateParts[2],
		', ',
		reviewDateParts[3]
	);
	return formattedReviewTime.concat(', ', formattedReviewDate);
}

export function consoleDisplayToLink(displayName) {
	switch (displayName) {
		case 'PlayStation 4':
			return 'ps4';
		case 'PC':
			return 'pc';
		case 'XBox One':
			return 'xboxone';
		case 'Nintendo Switch':
			return 'switch';
		default:
			return '';
	}
}
