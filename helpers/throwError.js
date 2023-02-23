exports.throwError = (status, message, data) => {
  const error = new Error(message);
  error.statusCode = status;
  error.data = data;
  throw error;
};
