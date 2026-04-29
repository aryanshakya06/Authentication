import asyncHandler from "../middlewares/asyncHandler.js";
import { User } from "../models/user.model.js";

export const adminController = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments();
    res.json({
        success: true,
        message: `Hello Admin, ${req.user?.name || "there"}`,
        data: { totalUsers }
    });
});
