export const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Zod errors
  if (err.name === "ZodError") {
    return res.status(400).json({
      message: "Validation error",
      errors: err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }

  // Mongo duplicate key
  if (err.code === 11000) {
    return res.status(400).json({
      message: "Duplicate field value",
    });
  }

  res.status(500).json({
    message: err.message || "Server error",
  });
};