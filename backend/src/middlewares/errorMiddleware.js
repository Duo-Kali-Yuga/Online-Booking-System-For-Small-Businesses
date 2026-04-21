import { errorResponse } from "../utils/response.js";

export const errorHandler = (err, req, res, next) => {
  console.error("❌ ERROR:", err.message);

  // Zod validation
  if (err.name === "ZodError") {
    return errorResponse(
      res,
      "Validation error",
      400,
      err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }))
    );
  }

  // Mongo duplicate
  if (err.code === 11000) {
    return errorResponse(res, "Duplicate field value", 400);
  }

  // Custom errors
  if (err.message) {
    return errorResponse(res, err.message, 400);
  }

  return errorResponse(res, "Server error", 500);
};