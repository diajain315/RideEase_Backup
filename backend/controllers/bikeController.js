  import bikeModel from "../models/bikeModel.js";
  import fs from "fs";
  import path from "path";
  import slugify from "slugify";

  export const addBikeController = async (req, res) => {
  console.log("🔥🔥🔥 CONTROLLER HIT! 🔥🔥🔥");
  console.log("📦 req.fields:", req.fields);
  console.log("📁 req.files:", req.files);

  try {
    console.log("========================================");
    console.log("🔍 1. req.fields:", req.fields);
    console.log("🔍 2. req.files:", req.files);
    console.log("========================================");

    // Check if formidable parsed the form correctly
    if (!req.fields) {
      console.error("❌ req.fields is undefined!");
      return res.status(400).send({
        success: false,
        message: "Form data not parsed. Make sure you are sending multipart/form-data",
      });
    }

    const {
      name,
      number,
      price,
      category,
      startType,
      year,
      kilometers,
      petrolCapacity,
      description,
    } = req.fields;

    const { photo } = req.files || {};

    console.log("📝 Extracted Fields:", {
      name,
      number,
      price,
      category,
      startType,
      year,
      kilometers,
      petrolCapacity,
      description,
    });

    console.log(
      "📷 Photo:",
      photo ? `File: ${photo.name}, Size: ${photo.size}` : "No Photo"
    );

    // ==========================
    // Validations
    // ==========================

    if (!name)
      return res.status(422).send({
        success: false,
        message: "Name is required",
      });

    if (!number)
      return res.status(422).send({
        success: false,
        message: "Bike Number is required",
      });

    if (!price)
      return res.status(422).send({
        success: false,
        message: "Price is required",
      });

    if (!category)
      return res.status(422).send({
        success: false,
        message: "Category is required",
      });

    if (!startType)
      return res.status(422).send({
        success: false,
        message: "Start Type is required",
      });

    if (!year)
      return res.status(422).send({
        success: false,
        message: "Year is required",
      });

    if (!kilometers)
      return res.status(422).send({
        success: false,
        message: "Kilometers are required",
      });

    if (!petrolCapacity)
      return res.status(422).send({
        success: false,
        message: "Petrol Capacity is required",
      });

    if (!description)
      return res.status(422).send({
        success: false,
        message: "Description is required",
      });

    if (!photo)
      return res.status(422).send({
        success: false,
        message: "Bike Image is required",
      });

    if (photo.size > 5000000)
      return res.status(422).send({
        success: false,
        message: "Image should be less than 5 MB",
      });

    console.log("✅ Validation Passed");

    // ==========================
    // Create Bike
    // ==========================

    const bike = new bikeModel({
      ...req.fields,
      slug: slugify(name),
    });

    if (photo) {
      bike.photo.data = fs.readFileSync(photo.path);
      bike.photo.contentType = photo.type;
    }

    console.log("💾 Saving bike to MongoDB...");

    const savedBike = await bike.save();

    console.log("✅ Bike Saved Successfully");
    console.log(savedBike);

    return res.status(201).send({
      success: true,
      message: "Bike added successfully",
      bike: savedBike,
    });
  } catch (error) {
    console.error("❌ ERROR WHILE ADDING BIKE");
    console.error(error);

    return res.status(500).send({
      success: false,
      message: "Error in adding bike",
      error: error.message,
    });
  }
};
  // get all bikes

  export const getBikeAllController = async (req, res) => {
    try {
      // const { category } = req.query;
      // let query = bikeModel.find({});
      // if (category) {
      //   query = query.populate({
      //     path: "category",
      //     match: { name: category },
      //   });
      // } else {
      //   query = query.populate("category", "-photo");
      // }
      // const bikes = await query.select("-photo").sort({ createdAt: -1 });
      // const filteredBikes = bikes.filter((bike) => bike.category !== null);
      const bikes = await bikeModel
        .find({})
        .populate("category", "-photo")
        .select("-photo")
        .limit(10)
        .sort({ createdAt: -1 });
      res.status(200).send({
        success: true,
        total: bikes.length,
        message: "Successfully fetched all bikes",
        bikes,
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "Unsuccessful fetching all bikes",
        error,
      });
    }
  };

  // get single bike by slug : for admin side
  export const getSingleBikeController = async (req, res) => {
    try {
      const bike = await bikeModel
        .findOne({ slug: req.params.slug })
        .select("-photo")
        .populate("category", "-photo");
      res.status(200).send({
        success: true,
        message: "Successfully fetched bike",
        bike,
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "Something went wrong",
        error,
      });
    }
  };

  // get single bike by bid : for customer side
  export const getSingleBikeControllerById = async (req, res) => {
    try {
      const bike = await bikeModel
        .findOne({ _id: req.params.bid })
        .select("-photo")
        .populate("category", "-photo");
      res.status(200).send({
        success: true,
        message: "Successfully fetched bike",
        bike,
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "Something went wrong",
        error,
      });
    }
  };

  // updatebikecontroller
  export const updateBikeController = async (req, res) => {
    try {
      const { name, description, price, category, kilometers, startType, year, petrolCapacity } = req.fields;
      const { photo } = req.files || {};
      
      if (!name) return res.status(422).send({ message: "Name is required" });
      if (!description) return res.status(422).send({ message: "Description is required" });
      if (!price) return res.status(422).send({ message: "Price is required" });
      if (!category) return res.status(422).send({ message: "Category is required" });
      if (!startType) return res.status(422).send({ message: "Start type is required" });
      if (!year) return res.status(422).send({ message: "Year is required" });
      if (!kilometers) return res.status(422).send({ message: "Kilometers is required" });
      if (!petrolCapacity) return res.status(422).send({ message: "Petrol capacity is required" });
      if (photo && photo.size > 5000000) {
        return res.status(422).send({ message: "Image should be less than 5Mb" });
      }

      const bike = await bikeModel.findById(req.params.bid);
      if (!bike) {
        return res.status(404).send({ success: false, message: "Bike not found" });
      }

      Object.assign(bike, {
        name,
        description,
        price,
        category,
        kilometers,
        startType,
        year,
        petrolCapacity,
        slug: slugify(name),
      });

      if (photo && photo.path) {
        bike.photo = {
          data: fs.readFileSync(photo.path),
          contentType: photo.type,
        };
      }

      await bike.save();
      res.status(200).send({
        success: true,
        message: "Bike updated successfully",
        bike,
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "Error in updating bike",
        error: error.message,
      });
    }
  };

  export const deleteBikeController = async (req, res) => {
    try {
      await bikeModel.findByIdAndDelete(req.params.bid).select("-photo");
      res.status(200).send({
        success: true,
        message: "Bike deleted successfully",
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "Error in deleting bike",
        error,
      });
    }
  };

  export const bikePhotoController = async (req, res) => {
    try {
      const bike = await bikeModel.findById(req.params.bid).select("photo");
      if (bike && bike.photo && bike.photo.data) {
        res.set("Content-type", bike.photo.contentType);
        return res.status(200).send(bike.photo.data);
      }
      return res.status(404).send({ message: "No photo found" });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "Error while getting bike image",
        error: error.message,
      });
    }
  };

  // bikefilter controller
  export const bikeFilterController = async (req, res) => {
    try {
      const { checked = [], radio = [] } = req.body || {};
      let args = {};
      if (Array.isArray(checked) && checked.length > 0) args.category = { $in: checked };
      if (Array.isArray(radio) && radio.length === 2) args.price = { $gte: radio[0], $lte: radio[1] };
      const bikes = await bikeModel
        .find(args)
        .populate("category", "-photo")
        .select("-photo");
      res.status(200).send({
        success: true,
        message: "Successfully fetched filtered bikes",
        bikes,
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "Error while filtering bikes",
        error: error.message,
      });
    }
  };

  // bike count
export const bikeCountController = async (req, res) => {
  try {
    const total = await bikeModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// bike per page
export const bikeListController = async (req, res) => {
  try {
    const perPage = 8;
    const page = req.params.page ? req.params.page : 1;
    const bikes = await bikeModel
      .find({})
      .select("-photo")
      .populate("category", "-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "Successfully fetched products per page",
      bikes,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in fetching per page",
      error: error.message,
    });
  }
};
