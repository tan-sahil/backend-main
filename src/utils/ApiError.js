

class ApiError extends Error{
  constructor(
    message = "something is wrong",
    statusCode,
    errors = [] , // multiple error le lete hai.
    stack = ""
  ){
    super(message)   // overwrite krne k liye
    this.message = message
    this.statusCode = statusCode
    this.data = null
    this.errors = errors
    if(stack){
        this.stack= stack
    }else{
        Error.captureStackTrace(this, this.constructor);
    }
  }
}

export {ApiError};