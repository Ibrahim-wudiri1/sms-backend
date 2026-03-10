"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema, type = "body") => (req, res, next) => {
    try {
        const result = schema.parse(req[type]);
        req[type] = result;
        next();
    }
    catch (error) {
        return res.status(400).json({
            message: "Validation failed",
            errors: error.errors,
        });
    }
};
exports.validate = validate;
//# sourceMappingURL=validator.js.map