import { validationResult } from "express-validator";

const validate = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: result.array().map(({ path, msg }) => ({
        field: path,
        message: msg,
      })),
    });
  }

  next();
};

export default validate;