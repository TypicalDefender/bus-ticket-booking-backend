//imports
const config = require('config');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const ticket = require('./routes/tickets');
const admin = require('./routes/users');

const app = express();

//database connection function
(async function connectDB() {
    try {
        const URI = config.get(app.get('env')).MONGO_URI;
        const connect = await mongoose.connect(URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        console.log("Connected to the database:", connect.connections[0].name);
    } catch (err) {
        console.log("Error connecting the database", err);
    }
})();

//morgan for development environment
if (app.get('env') == "development") {
    app.use(morgan('tiny'));
}

app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.use(express.json());
// app.use('/api', user);
app.use('/api', ticket);
app.use('/private', admin);
//port setup
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`magic happens on ${PORT}`);
});