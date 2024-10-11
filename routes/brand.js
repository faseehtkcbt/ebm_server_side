const express = require('express');
const router = express.Router();
const Brand = require('../model/brand');
// const Product = require('../model/product');
const asyncHandler = require('express-async-handler');
const isAuth = require('../middleware/is-auth');

// Get all brands
router.get('/',isAuth, asyncHandler(async (req, res) => {
    try {
        const brands = await Brand.find().populate('categoryId').sort({'categoryId': 1});
        res.json({ success: true, message: "Brands retrieved successfully.", data: brands });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));

// Get a brand by ID
router.get('/:id',isAuth, asyncHandler(async (req, res) => {
    try {
        const brandID = req.params.id;
        const brand = await Brand.findById(brandID).populate('categoryId');
        if (!brand) {
            return res.status(404).json({ success: false, message: "Brand not found." });
        }
        res.json({ success: true, message: "Brand retrieved successfully.", data: brand });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));

// Create a new brand
router.post('/',isAuth, asyncHandler(async (req, res) => {
    const { name, categoryId } = req.body;
    if (!name || !categoryId) {
        return res.status(400).json({ success: false, message: "Name and category ID are required." });
    }

    try {
        const brand = new Brand({ name, categoryId });
        const newBrand = await brand.save();
        res.json({ success: true, message: "Brand created successfully.", data: null });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));

// Update a brand
router.put('/:id',isAuth, asyncHandler(async (req, res) => {
    const brandID = req.params.id;
    const { name, categoryId } = req.body;
    if (!name || !categoryId) {
        return res.status(400).json({ success: false, message: "Name and category ID are required." });
    }

    try {
        const updatedBrand = await Brand.findByIdAndUpdate(brandID, { name, categoryId }, { new: true });
        if (!updatedBrand) {
            return res.status(404).json({ success: false, message: "Brand not found." });
        }
        res.json({ success: true, message: "Brand updated successfully.", data: null });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));

// Delete a brand
router.delete('/:id',isAuth, asyncHandler(async (req, res) => {
    const brandID = req.params.id;
    try {
        // Check if any products reference this brand
        // // const products = await Product.find({ proBrandId: brandID });
        // if (products.length > 0) {
        //     return res.status(400).json({ success: false, message: "Cannot delete brand. Products are referencing it." });
        // }

        // If no products are referencing the brand, proceed with deletion
        const brand = await Brand.findByIdAndDelete(brandID);
        if (!brand) {
            return res.status(404).json({ success: false, message: "Brand not found." });
        }
        res.json({ success: true, message: "Brand deleted successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));


module.exports = router;
