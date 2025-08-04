const createError =
  (name, status) =>
  (message = name) => {
    const err = new Error(message);
    err.name = name;
    err.status = status;
    return err;
  };

// common errors
const NotFoundError = createError('NotFoundError', 404);
const ValidationError = createError('ValidationError', 400);

module.exports = { createError, NotFoundError, ValidationError };
