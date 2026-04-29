import tryCatch from "../middlewares/tryCatch.js";

export const adminController = tryCatch(async(req, res) => {
    return res.json({message: "Hello Admin"});
})