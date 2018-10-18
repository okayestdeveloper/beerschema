
'use strict';

const aws = require('aws-sdk');
const dynamo = new aws.DynamoDB.DocumentClient({ region: process.env.awsRegion });
const tableName = process.env.hopsTableName;
const uuidv1 = require('uuid/v1');

/**
 * Retrieve on hop record by id from Dynamo DB
 * @param {string} id
 * @return {Promise}
 */
function getHop(id) {
    return dynamo
        .get({
            Key: { id },
            TableName: tableName
        })
        .promise()
        .then((data) => data.Item);
}

/**
 * Get all the hops
 * TODO: pagination
 * @return {Promise}
 */
function listHops() {
    return dynamo
        .scan({
            TableName: tableName
        })
        .promise()
        .then((data) => data.Items);
}

/**
 * Create a hop
 * @param {object} hop model instance
 * @return {Promise}
 */
function createHop(hop) {
    hop.id = uuidv1();
    return dynamo
        .put({
            TableName: tableName,
            Item: hop
        })
        .promise();
}

/**
 * Update a hop
 * @param {object} hop model instance
 * @return {Promise}
 */
function updateHop(hop) {
    return dynamo
        .put({
            TableName: tableName,
            Item: hop,
            ReturnValues: 'ALL_NEW'
        })
        .promise()
        .then((data) => data.Attributes);
}

/**
 * Delete a hop
 * @param {string} id
 * @return {Promise}
 */
function deleteHop(id) {
    return dynamo
        .delete({
            Key: { id },
            TableName: tableName
        })
        .promise();
}

module.exports = {
    getHop,
    listHops,
    createHop,
    updateHop,
    deleteHop
};
