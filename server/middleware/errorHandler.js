const asyncHandler =
  (fn) =>
  (req, res, next, ...args) => {
    Promise.resolve(fn(req, res, next, ...args)).catch(next);
  };

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Server Error",
  });
};

module.exports = { asyncHandler, errorHandler };