const {ResponseError} = require('../errors/response-error')

function validate(schema, request) {
    const result = schema.validate(request, {
        abortEarly: false,
        allowUnknown: false,
    });

    if (result.error) {
        const errors = {};

        for (let error of result.error.details) {
            errors[error.context.label] = error.message;
        }

        throw new ResponseError(400, "Data is invalid", errors);
    } else {
        return result.value;
    }
}

module.exports = { validate };
