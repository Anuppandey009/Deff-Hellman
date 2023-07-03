const Joi = require("joi");

module.exports = {
  validateBody: (schema) => {
    return (req, res, next) => {
        console.log("req.body>>>>>>>>>>> ", req.body);
    

      const result = schema.validate(req.body);
      console.log("result >>>>>>>>>>>>> ",result);
      if (result.error) {
        let err_msg = {};
        for (let counter in result.error.details) {
          let key = result.error.details[counter].context.key;
          let val = result.error.details[counter].message;
          err_msg[key] = val;
        }
        let return_err = { status: 2, errors: err_msg };
        return res.status(400).json(return_err);
      }
      if (!req.value) {
        req.value = {};
      }
      req.value["body"] = result.value;
      next();
    };
  },

  schemas: {
    validateDetails: Joi.object().keys({
      encryptedText: Joi.string().required(),
    }),
  },
};
