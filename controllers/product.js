const { validationResult } = require('express-validator');

const Product = require('../models/product');
const { clearImage } = require('../utils/product');

exports.getProducts = async (req, res, next) => {
    // const currentPage = Number.parseInt(req.query.page) || 1;
    // const perPage = Number.parseInt(req.query.perpage) || 4;
    try {
        const totalProduct = await Product.find().countDocuments();
        const products = await Product.find();
            // .skip((currentPage - 1) * perPage)
            // .limit(perPage);

        res.status(200).json({ products, totalProduct });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getProduct = async (req, res, next) => {
    const productId = req.params.productId;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            const error = new Error('Could not find product.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ product });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.createProduct = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Validation Error.');
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }
        const { title, price, info } = req.body;
        const imageUrl = `images/${req.file.filename}`;

        if (!imageUrl) {
            const error = new Error('Please select an image to upload.');
            error.statusCode = 422;
            throw error;
        }

        const product = new Product({
            title,
            price,
            imageUrl,
            info,
            creator: req.userId
        });
        await product.save();

        res.status(201).json({ message: 'Product created.', product });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.updateProduct = async (req, res, next) => {
    const productId = req.params.productId;

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Validation failed.');
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }

        let { title, price, imageUrl, info } = req.body;
        if (req.file) {
            imageUrl = `images/${req.file.filename}`;
        }
        if (!imageUrl) {
            const error = new Error('No image picked.');
            error.statusCode = 422;
            throw error;
        }

        const product = await Product.findById(productId);

        if (!product) {
            const error = new Error('Could not find the product.');
            error.statusCode = 404;
            throw error;
        }

        if (imageUrl !== product.imageUrl) {
            console.log(product.imageUrl);
            clearImage(product.imageUrl);
        }

        product.title = title;
        product.price = price;
        product.imageUrl = imageUrl;
        product.info = info;

        await product.save();

        res.status(200).json({ message: 'Product updated.', product });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.deleteProduct = async (req, res, next) => {
    const productId = req.params.productId;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            const error = new Error('Could not find the product.');
            error.statusCode = 404;
            throw error;
        }
        clearImage(product.imageUrl);
        await Product.findByIdAndRemove(productId);

        res.status(200).json({ message: 'Product has been deleted.' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
