// An error that carries an HTTP status code, thrown from services/middleware
// and turned into a JSON response by middleware/errorHandler.js.
export default class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}
