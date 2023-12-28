class ErrorApis extends Error {
    constructor (
        message = "something is wrong",
        errors = [], // can be multiple errors
        statusCode,
        stack= '',

    ){
        super(message);
        this.errors = errors;
        this.statusCode = statusCode;
        this.data = null;
        if(stack){
            this.stack = stack;
        }else {
            Error.captureStackTrace(this, this.constructor);
        }
        

    }


}

export {ErrorApis};

// this is the ssecond time ive written this errors api because its the most important thing right now just to understand to 

// v\bassicall how to handle everything amd how in general this api of error is gonna be used during my bussiness logic 

// just to make sure that im just writing what is right for me..
 