exports.throwError = (status, message, data, showClientMessage) => {
  const error = new Error(message);
  error.showClientMessage = showClientMessage;
  error.statusCode = status;
  error.data = data;
  throw error;
};
