const { NODE_ENV } = require("../config/env");

module.exports = function errorHandler(err, req, res, next) {
  const isValidStatusCode =
    typeof err?.statusCode === "number" && err.statusCode >= 400 && err.statusCode <= 599;

  const statusCode = isValidStatusCode ? err.statusCode : 500;
  const response = {
    error: err?.code || "INTERNAL_ERROR",
    message: statusCode === 500 ? "Something went wrong" : err.message,
  };

  if (NODE_ENV !== "production") {
    console.error(err);
    response.stack = typeof err?.stack === "string" ? err.stack : String(err);
  }

  res.status(statusCode).json(response);
};
