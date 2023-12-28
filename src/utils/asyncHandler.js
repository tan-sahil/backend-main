// method which will be HOF 
//by promise

const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(err => next(err))
    }


}

export {asyncHandler}


// async await>>.

// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//        await fn(req, res, next);
//     } catch (error) {
//         console.log("error is : ", error);
//     }
// }