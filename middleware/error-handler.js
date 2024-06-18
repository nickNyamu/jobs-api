const { CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: error.message || "Something went wrong, try again later",
  };

  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }

  if(err.name === 'ValidationError') {
    // console.log(Object.values(err.errors)); // array of objects properties: {validator, message, kind, path, value, reason}
    customError.statusCode = StatusCodes.BAD_REQUEST; // 400
    const msg = Object.values(err.errors).map(item => item.message).join(', ');
    customError.msg = msg;
  }


  if (err.code && err.code === 11000) {
    customError.statusCode = StatusCodes.BAD_REQUEST; // 400
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
  }


  if (err.name === "CastError") {
    customError.statusCode = StatusCodes.NOT_FOUND; // 404
    customError.msg = `No item found with id : ${err.value}`;
  }

  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
