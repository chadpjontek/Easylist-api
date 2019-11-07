const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const { DB_URI } = require('./config');

require('dotenv').config();

const app = express();

// Add whtelist to cors
let origin;
process.env.NODE_ENV === 'development' ? origin = 'http://localhost:8080' : origin = 'https://easylist.link';
const corsOptions = {
  origin,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

//  apply to all requests
app.use(limiter);

// Connect to mongoDB with mongoose. Handle depreciation warnings.
mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true
});

// Middlewares
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/lists', require('./routes/lists'));

// Start the server
app.listen(process.env.PORT);
console.log(`Server listening at ${process.env.PORT}`);