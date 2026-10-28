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
    const { name } = req.body;
    const { _id } = req.params;
    if (!name) {
      return res.status(400).send({
        message: "Name is required",
      });
    }
    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }
    const category = await categoryModel.findByIdAndUpdate(
      _id,
      { name, slug: slugify(name) },
      { new: true }
    );
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }
    res.status(200).send({
      success: true,
      messsage: "Category Updated Successfully",
      category,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
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
