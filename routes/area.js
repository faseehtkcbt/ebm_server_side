const express = require('express');
const router = express.Router();
const Area = require('../model/area');
// const SubCategory = require('../model/subCategory');
// const Product = require('../model/product');
// const { uploadCategory } = require('../uploadFile');
// const multer = require('multer');
const asyncHandler = require('express-async-handler');
const isAuth = require('../middleware/is-auth');

// Get all area
router.get('/',isAuth, asyncHandler(async (req, res) => {
    try {
        const areas = await Area.find();
        res.json({ success: true, message: "Areas retrieved successfully.", data: areas });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));

// Get a area by ID
router.get('/:id',isAuth, asyncHandler(async (req, res) => {
    try {
        const areaID = req.params.id;
        const area = await Area.findById(areaID);
        if (!area) {
            return res.status(404).json({ success: false, message: "Area not found." });
        }
        res.json({ success: true, message: "Area retrieved successfully.", data: area });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));

// Create a new area
router.post('/',isAuth, asyncHandler(async (req, res) => {
    try {
        const name  = req.body.name;
        console.log(name);
        if (!name) {
            return res.status(400).json({ success: false, message: "Name is required." });
        }
        try {
            const newArea = new Area({
                name: name,
            });
            await newArea.save();
            res.json({ success: true, message: "Area created successfully.", data: null });
        } catch (error) {
            console.error("Error creating area:", error);
            res.status(500).json({ success: false, message: error.message });
        }

    } catch (err) {
        console.log(`Error creating area: ${err.message}`);
        return res.status(500).json({ success: false, message: err.message });
    }
}));

// Update an area
router.put('/:id',isAuth, asyncHandler(async (req, res) => {
    try {
        const areaID = req.params.id;
        const name  = req.body.name;
        if (!name ) {
            return res.status(400).json({ success: false, message: "Name is required." });
        }

        try {
            const updatedArea = await Area.findByIdAndUpdate(areaID, { name: name}, { new: true });
            if (!updatedArea) {
                return res.status(404).json({ success: false, message: "Area not found." });
            }
            res.json({ success: true, message: "Area updated successfully.", data: null });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }

    } catch (err) {
        console.log(`Error updating area: ${err.message}`);
        return res.status(500).json({ success: false, message: err.message });
    }
}));

// Delete a area
router.delete('/:id',isAuth, asyncHandler(async (req, res) => {
    try {
        const areaID = req.params.id;

        // Check if any subcategories reference this category
        // const subcategories = await SubCategory.find({ categoryId: categoryID });
        // if (subcategories.length > 0) {
        //     return res.status(400).json({ success: false, message: "Cannot delete category. Subcategories are referencing it." });
        // }

        // Check if any products reference this category
        // const products = await Product.find({ proCategoryId: categoryID });
        // if (products.length > 0) {
        //     return res.status(400).json({ success: false, message: "Cannot delete category. Products are referencing it." });
        // }

        // If no subcategories or products are referencing the category, proceed with deletion
        const area = await Area.findByIdAndDelete(areaID);
        if (!area) {
            return res.status(404).json({ success: false, message: "Area not found." });
        }
        res.json({ success: true, message: "Area deleted successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));

module.exports = router;
