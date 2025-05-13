const { validationResult, check } = require('express-validator');

const bookingValidationRules = [
    check('checkIn').notEmpty().isDate(),
    check('checkOut').notEmpty().isDate(),
    check('adults').isInt({ min: 1 }),
    check('children').isInt({ min: 0 }),
    check('totalPrice').isFloat({ min: 0 })
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    bookingValidationRules,
    validate
};