const express = require('express');
const { body } = require('express-validator');

const productController = require('../controllers/product');
const { isAuth } = require('../middlewares/is-auth');
const upload = require('../utils/multer');

const router = express.Router();

//──── GET Http Methods ──────────────────────────────────────────────────────────────────
// GET /api/products
router.get('/products', productController.getProducts);

// GET /api/product/:productId
router.get('/product/:productId', productController.getProduct);
//──── GET Http Methods ──────────────────────────────────────────────────────────────────

//──── POST Http Methods ─────────────────────────────────────────────────────────────────
// POST /api/product
router.post(
    '/product',
    isAuth,
    upload.single('imageUrl'),
    [
        body('title')
            .trim()
            .isLength({ min: 5 })
            .not()
            .isEmpty(),
        body('info')
            .trim()
            .not()
            .isEmpty()
    ],
    productController.createProduct
);
//──── POST Http Methods ─────────────────────────────────────────────────────────────────

//──── PUT Http Methods ──────────────────────────────────────────────────────────────────
// PUT /api/product/:productId
router.put(
    '/product/:productId',
    isAuth,
    upload.single('imageUrl'),
    [
        body('title')
            .trim()
            .isLength({ min: 5 })
            .not()
            .isEmpty(),
        body('info')
            .trim()
            .not()
            .isEmpty()
    ],
    productController.updateProduct
);
//──── PUT Http Methods ──────────────────────────────────────────────────────────────────

//──── DELETE Http Methods ───────────────────────────────────────────────────────────────
// DELETE /api/product/:productId
router.delete('/product/:productId', isAuth, productController.deleteProduct);
//──── DELETE Http Methods ───────────────────────────────────────────────────────────────

module.exports = router;
