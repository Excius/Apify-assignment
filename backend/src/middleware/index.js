const apiVerify = (req, res, next) => {
  const apiHeader = req.headers["authorization"];

  if (!apiHeader) {
    return res.status(400).json({ error: "API key is required" });
  }

  const apiKey = apiHeader.split(" ")[1];

  req.apiKey = apiKey;

  next();
};

const globalErrorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
};

const requestLogger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

export { apiVerify, globalErrorHandler, requestLogger };
