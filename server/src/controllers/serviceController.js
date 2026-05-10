import Service from "../models/Service.js";

// GET /api/services
// Public — returns only approved services
// Query params: search, type, location, region, page, limit
export const getServices = async (req, res, next) => {
  try {
    const { search, type, location, region, page = 1, limit = 8 } = req.query;

    const filter = { status: "approved" };

    if (search) {
      filter.$text = { $search: search };
    }
    if (type) filter.badge = type;
    if (location) filter.location = new RegExp(location, "i");
    if (region) filter.region = region;

    const total = await Service.countDocuments(filter);
    const services = await Service.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select("-__v -submittedBy");

    res.json({
      services,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/services/featured
// Public — returns featured approved services for the home page
export const getFeaturedServices = async (req, res, next) => {
  try {
    const services = await Service.find({ status: "approved", featured: true })
      .sort({ createdAt: -1 })
      .limit(4)
      .select("-__v -submittedBy");

    res.json({ services });
  } catch (err) {
    next(err);
  }
};

// GET /api/services/:id
// Public
export const getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findOne({
      _id: req.params.id,
      status: "approved",
    }).select("-__v");

    if (!service) {
      res.status(404);
      throw new Error("Service not found");
    }

    res.json({ service });
  } catch (err) {
    next(err);
  }
};

// POST /api/services
// Protected — logged in users can submit. Starts as "pending".
export const createService = async (req, res, next) => {
  try {
    const {
      name,
      badge,
      badgeColor,
      tags,
      location,
      region,
      address,
      phone,
      email,
      website,
      hours,
      description,
      about,
      coordinates,
    } = req.body;

    const service = await Service.create({
      name,
      badge,
      badgeColor,
      tags,
      location,
      region,
      address,
      phone,
      email,
      website,
      hours,
      description,
      about,
      coordinates,
      status: "pending",
      submittedBy: req.user._id,
    });

    res.status(201).json({
      message: "Service submitted successfully and is pending review",
      service,
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/services/:id/status
// Admin only — approve or reject a service
export const updateServiceStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      res.status(400);
      throw new Error("Status must be 'approved' or 'rejected'");
    }

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    if (!service) {
      res.status(404);
      throw new Error("Service not found");
    }

    res.json({ message: `Service ${status}`, service });
  } catch (err) {
    next(err);
  }
};

// PUT /api/services/:id
// Admin only — update any field
export const updateService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      res.status(404);
      throw new Error("Service not found");
    }

    res.json({ service });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/services/:id
// Admin only
export const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      res.status(404);
      throw new Error("Service not found");
    }

    res.json({ message: "Service deleted" });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/services
// Admin only — returns all services with any status, supports ?status= filter
export const getAdminServices = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search) filter.$text = { $search: search };

    const total = await Service.countDocuments(filter);
    const services = await Service.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("submittedBy", "name email");

    res.json({
      services,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Toggle featured status of a service
// @route   PATCH /api/services/:id/feature
// @access  Private/Admin
export const toggleFeatured = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      res.status(404);
      throw new Error("Service not found");
    }

    // Toggle the featured boolean
    service.featured =
      req.body.featured !== undefined ? req.body.featured : !service.featured;

    await service.save();

    res.json({
      success: true,
      service: {
        _id: service._id,
        featured: service.featured,
      },
    });
  } catch (err) {
    next(err);
  }
};
