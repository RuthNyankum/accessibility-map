import User from "../models/User.js";
import Service from "../models/Service.js";

// GET /api/users — Admin only
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .sort({ createdAt: -1 })
      .select("-password")
      .lean();

    const usersWithCounts = await Promise.all(
      users.map(async (u) => ({
        ...u,
        submissionsCount: await Service.countDocuments({ submittedBy: u._id }),
      })),
    );

    res.json({ users: usersWithCounts });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/users/:id/role — Admin only
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      res.status(400);
      throw new Error("Role must be 'user' or 'admin'");
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true },
    ).select("-password");
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/users/:id — Admin only
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    res.json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
};
