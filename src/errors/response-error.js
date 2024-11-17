class ResponseError extends Error {
  constructor(status = 500, message, errors = null) {
      super(message);
      this.name = this.constructor.name;
      this.status = status;
      this.errors = errors;
      Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { ResponseError };
