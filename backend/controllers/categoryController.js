import slugify from "slugify";
import fs from "fs";
import categoryModel from "../models/categoryModel.js";

export const createCategoryController = async (req, res) => {
  console.log(req.fields);
  console.log(req.files);

 try {
     const { name} = req.fields;
     const { photo } = req.files;
     //    validation
    //  switch (true) {
    //    case !name:
    //      return res.status(422).send({ message: "Name is required" });
     
    //    case !photo && photo.size > 40000:
    //      return res
    //        .status(422)
    //        .send({ message: "Image is required & should be less than 5Mb" });
    //  }
     
     const category = new categoryModel({ name, slug: slugify(name) });
     if (photo) {
       // console.dir(photo);
       category.photo.data = fs.readFileSync(photo.path);
       category.photo.contentType = photo.type;
     }
     await category.save();
     res.status(201).send({
       success: true,
       message: "Category added successfully",
       category,
     });
   } catch (error) {
     res.status(500).send({
       success: false,
       message: "Error in adding category",
       error,
     });
   }
};

export const updateCategoryController = async (req, res) => {
  try {
    const { _id } = req.params;

    // 1. Locate the existing category in MongoDB
    const category = await categoryModel.findById(_id);
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }

    // 2. Extract name from req.fields (formidable), req.body (json), or query
    const rawName = req.fields?.name ?? req.body?.name ?? req.query?.name;
    const submittedName = Array.isArray(rawName) ? rawName[0] : rawName;
    const nameString = typeof submittedName === "string" ? submittedName.trim() : "";

    // 3. Fallback to existing category name if not provided
    const resolvedName = nameString || category.name;

    if (!resolvedName) {
      return res.status(400).send({
        success: false,
        message: "Name is required",
      });
    }

    // 4. If name is being changed, verify uniqueness
    if (nameString && nameString !== category.name) {
      const existingCategory = await categoryModel.findOne({
        name: nameString,
        _id: { $ne: _id },
      });
      if (existingCategory) {
        return res.status(409).json({
          success: false,
          message: "Category with this name already exists",
        });
      }
      category.name = nameString;
      category.slug = slugify(nameString);
    }

    // 5. Check for uploaded photo file (via formidable multipart)
    const { photo } = req.files || {};
    if (photo && photo.path) {
      if (photo.size > 5000000) {
        return res.status(422).send({
          success: false,
          message: "Image should be less than 5 MB",
        });
      }
      category.photo = {
        data: fs.readFileSync(photo.path),
        contentType: photo.type || "image/jpeg",
      };
    }

    // 6. Support optional base64 photo upload (via JSON or fields)
    const photoData = req.fields?.photoData || req.body?.photoData;
    const photoType = req.fields?.photoType || req.body?.photoType || "image/jpeg";
    if (photoData && typeof photoData === "string") {
      const base64Clean = photoData.replace(/^data:image\/\w+;base64,/, "");
      category.photo = {
        data: Buffer.from(base64Clean, "base64"),
        contentType: photoType,
      };
    }

    await category.save();

    const updatedCategory = await categoryModel.findById(_id).select("-photo");

    res.status(200).send({
      success: true,
      message: "Category Updated Successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Error in updateCategoryController:", error);
    res.status(500).send({
      success: false,
      error: error.message || error,
      message: "Error while updating category",
    });
  }
};

export const getAllCategoriesController = async (req, res) => {
  try {
    const categories = await categoryModel.find({}).select("-photo");
    res.status(200).send({
      success: true,
      message: "Successfully fetched all categories",
      categories,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error in getting all categories",
      error,
      success: false,
    });
  }
};

export const getSingleCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug }).select("-photo");
    if (!category) {
      return res.status(400).send({
        message: "No category existing by that name/slug",
        success: false,
      });
    }
    res.status(200).send({
      success: true,
      message: "Successfully fetched single category",
      category,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error in getting single category",
    });
  }
};
// by id
export const getSingleCategoryControllerById = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ _id: req.params.id }).select("-photo");
    if (!category) {
      return res.status(400).send({
        message: "No category existing by that id",
        success: false,
      });
    }
    res.status(200).send({
      success: true,
      message: "Successfully fetched single category",
      category,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error in getting single category",
    });
  }
};

export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await categoryModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: `Deleted category successfully`,
      deletedCategory,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in deleting category",
      error,
    });
  }
};

export const categoryPhotoController = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.params.cid).select("photo");
    if (category && category.photo && category.photo.data) {
      res.set("Content-type", category.photo.contentType);
      return res.status(200).send(category.photo.data);
    }
    return res.status(404).send({ message: "No photo found" });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while getting category image",
      error: error.message,
    });
  }
};
