'use strict';

/**
 * Load up AJV and validate a model against schema
 * @param {Object} model a model that should match one of our schemas
 * @param {string} schemaPath path to a schema file
 * @return {Boolean} true if all is well
 * @throws a JSON.stringified array of
 */
function validateAgainstSchema(model, schemaPath) {
    const Ajv = require('ajv');
    const ajv = new Ajv();
    const validator = ajv.compile(require(schemaPath));
    const valid = validator(model);

    if (!valid) {
        throw new Error(ajv.errorsText(validator.errors));
    }

    return true;
}

module.exports = {
    validateAgainstSchema
}
