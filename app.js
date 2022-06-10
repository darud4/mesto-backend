const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors, celebrate } = require('celebrate');
// const cookieParser = require('cookie-parser');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { loginValidation, createUserValidation } = require('./utils/joiValidators');
const { errorHandler } = require('./utils/errorHandler');
const { checkToken } = require('./middlewares/auth');
const { handleCors } = require('./middlewares/cors');
const NotFound = require('./errors/NotFound');

const PORT = 3000;
const app = express();

app.use(handleCors);
// app.use(cookieParser());
app.use(bodyParser.json({ extended: true }));

app.use(requestLogger);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.post('/signin', celebrate(loginValidation), login);
app.post('/signup', celebrate(createUserValidation), createUser);

app.use(checkToken);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use(() => {
  throw new NotFound('Запрошенной страницы не существует');
});

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
