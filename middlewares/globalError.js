const globalError = (err, req, res, next) => {
    res
      .status(err.status || 500)
      .json({ message: err.message || "something wet wrong, try again!" });
  };
  
  module.exports = {
    globalError,
  };