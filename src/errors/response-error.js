class ResponseError extends Error {
  constructor(status, message, errors = null) {
    super(message);
    this.name = this.constructor.name; // Set name to class name for easier identification
    this.statusCode = status; // Rename status to statusCode to follow HTTP conventions
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor); // Capture stack trace
  }
}

module.exports = { ResponseError };
