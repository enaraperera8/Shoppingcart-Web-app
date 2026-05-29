export default function errorHandler(error, _request, response, _next) {
  if (error.code === "ER_DUP_ENTRY") {
    return response.status(409).json({ message: "This value already exists." });
  }
  if (error.code === "ER_NO_REFERENCED_ROW_2") {
    return response.status(400).json({ message: "The selected related record does not exist." });
  }

  const status = error.status || 500;
  const message = status === 500 ? "An unexpected server error occurred." : error.message;

  if (status === 500) {
    console.error(error);
  }

  response.status(status).json({ message });
}
