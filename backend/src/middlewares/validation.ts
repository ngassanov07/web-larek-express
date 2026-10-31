import { celebrate, Joi, Segments } from 'celebrate';

const productBody = Joi.object({
  title: Joi.string().required().min(2).max(30),
  description: Joi.string().optional(),
  image: Joi.object({
    fileName: Joi.string().required(),
    originalName: Joi.string().required(),
  }).required(),
  category: Joi.string()
    .valid('софт-скил', 'хард-скил', 'другое', 'дополнительное', 'кнопка')
    .required(),
  price: Joi.number().min(0).allow(null).optional(),
});

const orderBody = Joi.object({
  payment: Joi.string().valid('card', 'online').required(),
  email: Joi.string().email().required(),
  phone: Joi.string().trim().required(),
  address: Joi.string().trim().required(),
  total: Joi.number().min(0).required(),
  items: Joi.array()
    .items(Joi.string().hex().length(24))
    .min(1)
    .required(),
});

export const validateProduct = celebrate({
  [Segments.BODY]: productBody,
});

export const validateOrder = celebrate({
  [Segments.BODY]: orderBody,
});
