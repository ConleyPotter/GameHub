const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const cors = require('cors');
const expressGraphQL = require('express-graphql');
const models = require('./server/models/index');
const schema = require('./server/schema/schema');
const path = require('path');

const app = express();
const db = require('./config/keys').mongoURI;

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'));
	app.get('/', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}

mongoose
	.connect(db, {
		useNewUrlParser: true
	})
	.then(() => console.log('Connected to MongoDB successfully.'))
	.catch(err => console.log(err));

app.use(bodyparser.json());
app.use(cors());
app.use(
	'/graphql',
	expressGraphQL(req => {
		return {
			schema,
			context: {
				token: req.headers.authorization
			},
			graphiql: true
		};
	})
);

app.get('/', (req, res) => {
	res.send('Hello, World!');
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
