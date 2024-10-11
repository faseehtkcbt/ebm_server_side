const Invoice = require('../model/invoice');
const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const isAuth = require('../middleware/is-auth');

// Get all invoices
router.get('/',isAuth, asyncHandler(async (req, res) => {
    try {
        const invoices = await Invoice.find()
        .populate('customerId')
        .populate('products.productId');
        res.json({ success: true, message: "Invoices retrieved successfully.", data: invoices });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));

// Get a invoice by ID
router.get('/:id',isAuth, asyncHandler(async (req, res) => {
    try {
        const invoiceID = req.params.id;
        const invoice = await Invoice.findById(invoiceID)
        .populate('customerId')
        .populate('products.productId');
        console.log(invoice);
        if (!invoice) {
            console.log('hello');
            return res.status(404).json({ success: false, message: "Invoice not found." });
        }
        res.json({ success: true, message: "Invoice retrieved successfully.", data: invoice });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}));

// create new invoice
router.post('/',isAuth, asyncHandler(async (req, res) => {
    try {
        // Execute the Multer middleware to handle multiple file fields
        const { invoiceId, date, customerId, salesman, products, total} = req.body;

        // Check if any required fields are missing
       // Validation for required fields
    if (!invoiceId || !date || !customerId || !salesman || !products || !total) {
        return res.status(400).json({ success: false, message: "Required fields are missing." });
      }
  
      // Further validation for products array (optional)
      if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ success: false, message: "Products must be a non-empty array." });
      }
  
      // Validate each product in the array
      for (let product of products) {
        const { productId, quantity, price } = product;
        if (!productId || !quantity || !price) {
          return res.status(400).json({ success: false, message: "Product details are missing." });
        }
      }
        // Create a new invoice object with data
        const newInvoice = new Invoice({invoiceId,date,customerId,salesman,products,total});

        // Save the new invoice to the database
        await newInvoice.save();

        // Send a success response back to the client
        res.json({ success: true, message: "Invoice created successfully.", data: null });
    } catch (error) {
        // Handle any errors that occur during the process
        console.error("Error creating invoice:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}));

router.put('/:id',isAuth, asyncHandler(async (req, res) => {
    const invoice = req.params.id;
    try {
        // Execute the Multer middleware to handle file fields
        const { invoiceId, date, customerId, salesman, products, total} = req.body;

        // Find the product by ID
        const invoiceToUpdate = await Invoice.findById(invoice);
        if (!invoiceToUpdate) {
            return res.status(404).json({ success: false, message: "Product not found." });
        }
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ success: false, message: "Products must be a non-empty array." });
        }
      
          // Validate each product in the array
        for (let product of products) {
            const { productId, quantity, price } = product;
            if (!productId || !quantity || !price) {
              return res.status(400).json({ success: false, message: "Product details are missing." });
            }
         }
        // Update invoice properties if provided
        invoiceToUpdate.invoiceId = invoiceId || invoiceToUpdate.invoiceId;
        invoiceToUpdate.date = date || invoiceToUpdate.date;
        invoiceToUpdate.customerId = customerId || invoiceToUpdate.customerId;
        invoiceToUpdate.salesman = salesman || invoiceToUpdate.salesman;
        invoiceToUpdate.products = products || invoiceToUpdate.products;
        invoiceToUpdate.total = total || invoiceToUpdate.total;
       // Save the updated invoice
        await invoiceToUpdate.save();
        res.json({ success: true, message: "Invoice updated successfully." });
    } catch (error) {
        console.error("Error updating invoice:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}));

// Delete a invoice
router.delete('/:id',isAuth, asyncHandler(async (req, res) => {
    const invoiceId = req.params.id;
    try {
        const invoice = await Invoice.findByIdAndDelete(invoiceId);
        if (!invoice) {
            return res.status(404).json({ success: false, message: "Invoice not found." });
        }
        res.json({ success: true, message: "Invoice deleted successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));


module.exports = router;