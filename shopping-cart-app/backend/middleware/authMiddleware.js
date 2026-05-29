import jwt from "jsonwebtoken";

export function protect(request, _response, next) {
  const authorization = request.headers.authorization || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : null;

  if (!token) {
    const error = new Error("Authentication is required.");
    error.status = 401;
    return next(error);
  }

  try {
    request.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (_error) {
    const error = new Error("Authentication token is invalid.");
    error.status = 401;
    return next(error);
  }
}

export function adminOnly(request, _response, next) {
  if (request.user?.role !== "admin") {
    const error = new Error("Administrator access is required.");
    error.status = 403;
    return next(error);
  }
  return next();
}
