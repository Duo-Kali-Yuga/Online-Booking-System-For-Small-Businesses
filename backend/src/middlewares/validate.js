export const validate = (schema) => (req, res, next) => {
  try {
    const data = {
      body: req.body,
      query: req.query,
      params: req.params,
    };

    schema.parse(data.body);

    next();
  } catch (error) {
    next(error);
  }
};