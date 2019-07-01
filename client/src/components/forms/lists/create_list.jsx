import React from 'react';
import { Mutation } from 'react-apollo';
import { CREATE_LIST } from '../../../graphql/mutations';

class CreateList extends React.Component {
	constructor(props) {
		super(props);

		this.state = { name: '' };
	}

	update(e) {
		this.setState({ name: e.target.value });
	}

	handleSubmit() {}
}

export default CreateList;
