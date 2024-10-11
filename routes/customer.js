const express = require('express');
const router = express.Router();
const Customer = require('../model/customer');
const asyncHandler = require('express-async-handler');
const isAuth = require('../middleware/is-auth');

// Get all customers
router.get('/',isAuth, asyncHandler(async (req, res) => {
    try {
        const customers = await Customer.find()
        .populate('area', 'id name')
        .populate('category', 'id name');
        res.json({ success: true, message: "Customers retrieved successfully.", data: customers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));

// Get a customer by ID
router.get('/:id',isAuth, asyncHandler(async (req, res) => {
    try {
        const customerId = req.params.id;
        const customer = await Customer.findById(customerId)
        .populate('area', 'id name')
        .populate('category', 'id name');
        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found." });
        }
        res.json({ success: true, message: "Customer retrieved successfully.", data: customer });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));



// create new customer
router.post('/',isAuth, asyncHandler(async (req, res) => {
    try {
        // Execute the Multer middleware to handle multiple file fields
        const { code, name, area, category} = req.body;

        // Check if any required fields are missing
        if (!code || !name || !area || !category) {
            return res.status(400).json({ success: false, message: "Required fields are missing." });
        }

        // Create a new customer object with data
        const newCustomer = new Customer({code,name,area,category});

        // Save the new customer to the database
        await newCustomer.save();

        // Send a success response back to the client
        res.json({ success: true, message: "Customer saved successfully.", data: null });
    } catch (error) {
        // Handle any errors that occur during the process
        console.error("Error creating customer:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}));



// Update a customer
router.put('/:id',isAuth, asyncHandler(async (req, res) => {
    const customerId = req.params.id;
    try {
        // Execute the Multer middleware to handle file fields
        const { code, name, area, category} = req.body;
        // Find the customer by ID
        const customerToUpdate = await Customer.findById(customerId);
        if (!customerToUpdate) {
            return res.status(404).json({ success: false, message: "Customer not found." });
        }
        // Update customer properties if provided
        customerToUpdate.code = code || customerToUpdate.code;
        customerToUpdate.name = name || customerToUpdate.name;
        customerToUpdate.area = area || customerToUpdate.area;
        customerToUpdate.category = category || customerToUpdate.category;
       // Save the updated customer
        await customerToUpdate.save();
        res.json({ success: true, message: "Customer updated successfully." });
    } catch (error) {
        console.error("Error updating customer:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}));

// Delete a customer
router.delete('/:id',isAuth, asyncHandler(async (req, res) => {
    const customerID = req.params.id;
    try {
        const customer = await Customer.findByIdAndDelete(customerID);
        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found." });
        }
        res.json({ success: true, message: "Customer deleted successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));

module.exports = router;
