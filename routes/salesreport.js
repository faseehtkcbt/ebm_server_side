const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Area = require('../model/area');  // Assuming you have Area model defined
const Brand = require('../model/brand'); // Assuming you have Brand model defined
const Invoice = require('../model/invoice'); // Assuming you have Invoice model defined
const Customer = require('../model/customer'); // Assuming you have Customer model defined
const isAuth = require('../middleware/is-auth');

router.get('/',isAuth, async (req, res) => {
    const { area, customer, startDate, endDate, brand } = req.query;
  
    // Build query filters based on the input parameters
    let matchConditions = {};
  
    if (startDate && endDate) {
      matchConditions.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
  
    if (area) {
      const areaDoc = await Area.findOne({ name: area });
      if (areaDoc) {
        matchConditions['customer.area'] = areaDoc._id;
      }
    }
  
    if (customer) {
      const customerDoc = await Customer.findOne({ name: customer });
      if (customerDoc) {
        matchConditions['customerId'] = customerDoc._id;
      }
    }
  
    if (brand) {
      const brandDoc = await Brand.findOne({ name: brand });
      if (brandDoc) {
        matchConditions['productDetails.brand'] = brandDoc._id;
      }
    }
  
    // MongoDB Aggregation Pipeline
    const salesReport = await Invoice.aggregate([
        {
          $match: matchConditions,
        },
        // Unwind the products array to handle each product individually
        {
          $unwind: '$products',
        },
        {
          $lookup: {
            from: 'customers',
            localField: 'customerId',
            foreignField: '_id',
            as: 'customer',
          },
        },
        { $unwind: '$customer' },
        {
          $lookup: {
            from: 'areas',
            localField: 'customer.area',
            foreignField: '_id',
            as: 'customer.areaDetails',
          },
        },
        { $unwind: '$customer.areaDetails' },
        {
          $lookup: {
            from: 'products',
            localField: 'products.productId',
            foreignField: '_id',
            as: 'productDetails',
          },
        },
        { $unwind: '$productDetails' },
        {
          $lookup: {
            from: 'brands',
            localField: 'productDetails.brand',
            foreignField: '_id',
            as: 'productDetails.brandDetails',
          },
        },
        { $unwind: '$productDetails.brandDetails' },
        {
          $group: {
            _id: {
              area: '$customer.areaDetails.name',
              brand: '$productDetails.brandDetails.name',
              product: '$productDetails._id',
            },
            totalSales: { $sum: { $multiply: ['$products.quantity', '$products.price'] } },
            totalQuantity: { $sum: '$products.quantity' },
            productDetails: { $first: '$productDetails' },
          },
        },
        {
          $group: {
            _id: {
              area: '$_id.area',
              brand: '$_id.brand',
            },
            products: {
              $push: {
                productDetails: '$productDetails',
                totalSales: '$totalSales',
                totalQuantity: '$totalQuantity',
              },
            },
          },
        },
        {
          $group: {
            _id: '$_id.area',
            brands: {
              $push: {
                brand: '$_id.brand',
                products: '$products',
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            area: '$_id',
            brands: 1,
          },
        },
      ]);
      res.json({ success: true, message: "SalesReport retrieved successfully.", data: salesReport });
  });
  
module.exports = router;
