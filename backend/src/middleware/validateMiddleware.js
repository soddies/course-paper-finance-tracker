const validateRequest = (schema, source = 'body') => {
    return (req, res, next) => {
        try {
            let dataToValidate;
            if (source === 'query') {
                dataToValidate = req.query;
            }
            else if (source === 'params') {
                dataToValidate = req.params;
            }
            else {
                dataToValidate = req.body;
            }
            schema.parse(dataToValidate);
            next();
        } catch (error) {
            const issues = error.issues || error.errors || [];
            res.status(400).json({
                error: 'Ошибка валидации',
                details: issues.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            });
        }
    };
};

module.exports = {
    validateRequest
}