const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorHandler } = require('./utils/errorHandler');
const { handleCors } = require('./middlewares/cors');
const { PORT } = require('./config');
const router = require('./routes/index');

const app = express();

app.use(handleCors);
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
