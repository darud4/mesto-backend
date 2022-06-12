const { Joi } = require('celebrate');
const validator = require('validator');

const validateUrl = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) throw new Error('Неправильный формат ссылки');
  return value;
};

module.exports.createUserValidation = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateUrl),
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
    avatar: Joi.string().required().custom(validateUrl),
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
    link: Joi.string().required().custom(validateUrl),
  }),
};
