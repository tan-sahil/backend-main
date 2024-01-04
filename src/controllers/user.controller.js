import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
    // validation add
    res.status(200).json({
        message : "ok"
    })
})


export   {registerUser}