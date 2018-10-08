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
    const ajv = new Ajv({ schemaId: 'auto' });
    ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-07.json'));
    const schema = require(schemaPath);
    const valid = ajv.validate(schema.model);

    if (!valid) {
        throw new Error(ajv.errorsText());
    }

    return true;
}

module.exports = {
    validateAgainstSchema
}
