const notFound = (req, res, next) => {
  const error = new Error(`not found : ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statuscode = res.statuscode == 200 ? 500 : res.statuscode;
  res.json({
    message: err?.message,
    stack: err?.stack,
  });
};

export { errorHandler, notFound };
