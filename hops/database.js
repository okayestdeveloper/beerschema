
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
 * Get all the hops limited by pagination
 * TODO: pagination - apparently "Limit start, count" isn't supported in DynamoDB
 * @return {Promise}
 */
function listHops() {
    return dynamo
        .scan({
            TableName: tableName
        })
        .promise()
        .then((data) => data.Items || []);
    //     .query({
    //     TableName: tableName,
    //     ScanIndexForward: true,
    //     Limit: numItems,
    //     ExclusiveStartKey: {
    //         'label': ???
    //     }
    // })
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
        .promise()
        .then(() => hop); // return what we just inserted
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
            Item: hop // ,
            // ReturnValues: 'ALL_NEW' DynamoDB.PutItem doesn't support ALL_NEW apparently
        })
        .promise()
        .then(() => hop); // so just send back the updated version
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
