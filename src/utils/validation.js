const { ResponseError } = require('../errors/response-error.js');

function validate(schema, request) {
    const result = schema.validate(request, {
        abortEarly: false, // Gather all errors before aborting validation
        allowUnknown: false, // Disallow unknown keys that are not in the schema
        stripUnknown: true, // Strip out unknown keys to avoid unexpected data
    });

    if (result.error) {
        const errors = result.error.details.reduce((acc, error) => {
            acc[error.context.key] = error.message;
            return acc;
        }, {});

        throw new ResponseError(400, "Data is invalid", errors);
    } 
    return result.value;
}

module.exports = { validate };
