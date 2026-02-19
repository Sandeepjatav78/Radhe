import { body, validationResult } from 'express-validator';

// Validation middleware to check for errors
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false, 
            message: 'Validation failed', 
            errors: errors.array() 
        });
    }
    next();
};

// User registration validation rules
export const validateRegister = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
    
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Must be a valid email')
        .normalizeEmail(),
    
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/\d/).withMessage('Password must contain at least one number'),
    
    validate
];

// User login validation rules
export const validateLogin = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Must be a valid email')
        .normalizeEmail(),
    
    body('password')
        .notEmpty().withMessage('Password is required'),
    
    validate
];

// Product validation rules
export const validateProduct = [
    body('name')
        .trim()
        .notEmpty().withMessage('Product name is required')
        .isLength({ min: 3, max: 200 }).withMessage('Product name must be 3-200 characters'),
    
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 2000 }).withMessage('Description must not exceed 2000 characters'),
    
    body('category')
        .trim()
        .notEmpty().withMessage('Category is required'),
    
    body('variants')
        .isArray().withMessage('Variants must be an array')
        .custom((variants) => {
            if (!Array.isArray(variants) || variants.length === 0) {
                throw new Error('At least one product variant is required');
            }
            return true;
        }),
    
    validate
];

// Order validation rules
export const validateOrder = [
    body('userId')
        .notEmpty().withMessage('User ID is required')
        .isMongoId().withMessage('Invalid user ID'),
    
    body('items')
        .isArray().withMessage('Items must be an array')
        .custom((items) => {
            if (!Array.isArray(items) || items.length === 0) {
                throw new Error('Order must contain at least one item');
            }
            return true;
        }),
    
    body('amount')
        .notEmpty().withMessage('Amount is required')
        .isNumeric().withMessage('Amount must be a number')
        .custom((amount) => {
            if (amount <= 0) {
                throw new Error('Amount must be greater than 0');
            }
            return true;
        }),
    
    body('address')
        .notEmpty().withMessage('Address is required')
        .isObject().withMessage('Address must be an object'),
    
    validate
];

// Coupon validation rules
export const validateCoupon = [
    body('code')
        .trim()
        .notEmpty().withMessage('Coupon code is required')
        .isLength({ min: 4, max: 20 }).withMessage('Coupon code must be 4-20 characters')
        .toUpperCase(),
    
    body('cartTotal')
        .optional()
        .isNumeric().withMessage('Cart total must be a number')
        .custom((total) => {
            if (total < 0) {
                throw new Error('Cart total cannot be negative');
            }
            return true;
        }),
    
    validate
];

// MongoDB ID validation
export const validateMongoId = (paramName = 'id') => [
    body(paramName)
        .notEmpty().withMessage(`${paramName} is required`)
        .isMongoId().withMessage(`Invalid ${paramName}`),
    
    validate
];

// Generic sanitization middleware
export const sanitizeInputs = (req, res, next) => {
    // Remove any potential script tags from all string inputs
    const sanitize = (obj) => {
        for (let key in obj) {
            if (typeof obj[key] === 'string') {
                // Remove script tags and dangerous characters
                obj[key] = obj[key].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
                obj[key] = obj[key].trim();
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                sanitize(obj[key]);
            }
        }
    };
    
    sanitize(req.body);
    next();
};
