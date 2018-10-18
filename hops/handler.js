'use strict';

const statusCodes = require('beerschema-shared/constants').statusCodes;
const schemaValidator = require('beerschema-shared/validation').validateAgainstSchema;
const sanitizer = require('beerschema-shared/sanitizer');
const path = require('path');
const hopsSchemaPath = path.join(process.cwd(), 'hops.schema.json');
const database = require('./database');

const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
};

/**
 * Get one hop
 * @param {object} event the incoming triggering event. Contains query params and such.
 * @param {object} context execution context, I guess
 * @param {function} callback call to return error or success response
 */
function getHop(event, context, callback) {
    console.log(`${process.env.serviceName}: getHop called`);
    database.getHop(event.pathParameters.id)
        .then((hop) => {
            callback(null, {
                statusCode: statusCodes.OK,
                headers,
                body: JSON.stringify(hop)
            });
        })
        .catch((err) => callback(err));
}

/**
 * Get all hops
 * @param {object} event the incoming triggering event. Contains query params and such.
 * @param {object} context execution context, I guess
 * @param {function} callback call to return error or success response
 */
function listHops(event, context, callback) {
    console.log(`${process.env.serviceName}: listHops called`);
    database.listHops()
        .then((hops) => {
            callback(null, {
                statusCode: statusCodes.OK,
                headers,
                body: JSON.stringify(hops)
            });
        })
        .catch((err) => callback(err));
}

/**
 * Create a hop
 * @param {object} event the incoming triggering event. Contains query params and such.
 * @param {object} context execution context, I guess
 * @param {function} callback call to return error or success response
 */
function createHop(event, context, callback) {
    console.log(`${process.env.serviceName}: createHop called`);
    let hop = JSON.parse(event.body);

    // validation
    try {
        hop = sanitizer.sanitizeModel(hop); // get rid of html
        schemaValidator(hop, hopsSchemaPath); // validate against schema
    } catch (error) {
        console.error('createHop: Error(s) validating against schema: ', error);
        callback({
            statusCode: statusCodes.BAD_REQUEST,
            headers,
            body: JSON.stringify({ msg: 'Model failed schema validation.', extended: error.message })
        });
        return;
    }

    database.createHop(hop)
        .then((response) => {
            callback(null, {
                statusCode: statusCodes.CREATED,
                headers,
                body: JSON.stringify(response)
            });
        })
        .catch((err) => callback(err));
}

/**
 * Update a hop
 * @param {object} event the incoming triggering event. Contains query params and such.
 * @param {object} context execution context, I guess
 * @param {function} callback call to return error or success response
 */
function updateHop(event, context, callback) {
    console.log(`${process.env.serviceName}: updateHop called`);
    const hop = JSON.parse(event.body);
    hop.id = event.pathParameters.id;

    // validation
    try {
        hop = sanitizer.sanitizeModel(hop); // get rid of html
        schemaValidator(hop, hopsSchemaPath); // validate against schema
    } catch (error) {
        console.error('createHop: Error(s) validating against schema: ', error);
        callback({
            statusCode: statusCodes.BAD_REQUEST,
            headers,
            body: JSON.stringify({ msg: 'Model failed schema validation.', extended: error.message })
        });
        return;
    }

    database.updateHop(hop)
        .then((updated) => {
            callback(null, {
                statusCode: statusCodes.OK,
                headers,
                body: JSON.stringify(updated)
            });
        })
        .catch((err) => callback(err));
}

/**
 * Delete a hop
 * @param {object} event the incoming triggering event. Contains query params and such.
 * @param {object} context execution context, I guess
 * @param {function} callback call to return error or success response
 */
function deleteHop(event, context, callback) {
    console.log(`${process.env.serviceName}: deleteHop called`);
    database.updateHop(event.pathParameters.id)
        .then(() => {
            callback(null, {
                statusCode: statusCodes.NO_CONTENT,
                headers
            });
        })
        .catch((err) => callback(err));
}

module.exports = {
    getHop,
    listHops,
    createHop,
    updateHop,
    deleteHop
};
