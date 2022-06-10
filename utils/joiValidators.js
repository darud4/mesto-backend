const { Joi } = require('celebrate');

const urlPattern = /^https?:\/\/(www\.)?[a-z0-9.-]+\.[a-z]+(\/[a-z-]+)*?(\/[a-z0-9\-._~:/?#[\]@!$&'()*+,;=]+)?[/#]?$/i;

module.exports.createUserValidation = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(urlPattern),
  }),
};

module.exports.loginValidation = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

module.exports.idValidation = {
  params: Joi.object().keys({
    id: Joi.string().required().alphanum().min(24)
      .max(24),
  }),
};

module.exports.changeAvatarValidation = {
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(urlPattern),
  }),
};

module.exports.updateProfileValidation = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
};

module.exports.createCardValidation = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().regex(urlPattern),
  }),
};
