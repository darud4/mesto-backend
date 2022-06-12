const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorHandler } = require('./utils/errorHandler');
const { PORT } = require('./config');
const router = require('./routes/index');

const CORS_CONFIG = {
  credentials: true,
  origin: [
    'http://darud4-pr15.nomoredomains.xyz',
    'http://darud4-pr15.nomoredomains.xyz',
  ],
};

const app = express();

app.use(cors(CORS_CONFIG));
app.use(bodyParser.json({ extended: true }));

app.use(requestLogger);

app.use(router);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

function connectToBase() {
  mongoose
    .connect('mongodb://localhost:27017/mestodb', {
      useNewUrlParser: true,
    })
    .then(() => {
      app.listen(PORT);
    })
    .catch(() => { });
}

connectToBase();
