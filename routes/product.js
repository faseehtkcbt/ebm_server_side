const express = require('express');
const router = express.Router();
const Product = require('../model/product');
// const multer = require('multer');
// const { uploadProduct } = require('../uploadFile');
const asyncHandler = require('express-async-handler');
const isAuth = require('../middleware/is-auth');

// Get all products
router.get('/',isAuth, asyncHandler(async (req, res) => {
    try {
        const products = await Product.find()
        .populate('brand', 'id name')
        .populate('categoryId', 'id name');
        res.json({ success: true, message: "Products retrieved successfully.", data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));

// Get a product by ID
router.get('/:id',isAuth, asyncHandler(async (req, res) => {
    try {
        const productID = req.params.id;
        const product = await Product.findById(productID)
        .populate('brand', 'id name')
        .populate('categoryId', 'id name');
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found." });
        }
        res.json({ success: true, message: "Product retrieved successfully.", data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));



// create new product
router.post('/',isAuth, asyncHandler(async (req, res) => {
    try {
        // Execute the Multer middleware to handle multiple file fields
        const { code, name, description, brand, categoryId, quantity, price} = req.body;

        // Check if any required fields are missing
        if (!code || !name || !description || !brand || !categoryId || !quantity || !price) {
            return res.status(400).json({ success: false, message: "Required fields are missing." });
        }

        // Create a new product object with data
        const newProduct = new Product({code,name,description,brand,categoryId,quantity,price});

        // Save the new product to the database
        await newProduct.save();

        // Send a success response back to the client
        res.json({ success: true, message: "Product created successfully.", data: null });
    } catch (error) {
        // Handle any errors that occur during the process
        console.error("Error creating product:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}));



// Update a product
router.put('/:id',isAuth, asyncHandler(async (req, res) => {
    const productId = req.params.id;
    try {
        // Execute the Multer middleware to handle file fields
        const { code, name, description, brand, categoryId, quantity, price} = req.body;

        // Find the product by ID
        const productToUpdate = await Product.findById(productId);
        if (!productToUpdate) {
            return res.status(404).json({ success: false, message: "Product not found." });
        }
        // Update product properties if provided
        productToUpdate.code = code || productToUpdate.code;
        productToUpdate.name = name || productToUpdate.name;
        productToUpdate.description = description || productToUpdate.description;
        productToUpdate.brand = brand || productToUpdate.brand;
        productToUpdate.categoryId = categoryId || productToUpdate.categoryId;
        productToUpdate.quantity = quantity || productToUpdate.quantity;
        productToUpdate.price = price || productToUpdate.price;
       // Save the updated product
        await productToUpdate.save();
        res.json({ success: true, message: "Product updated successfully." });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}));

// Delete a product
router.delete('/:id',isAuth, asyncHandler(async (req, res) => {
    const productID = req.params.id;
    try {
        const product = await Product.findByIdAndDelete(productID);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found." });
        }
        res.json({ success: true, message: "Product deleted successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));

module.exports = router;
