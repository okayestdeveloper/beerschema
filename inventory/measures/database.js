'use strict';

const aws = require('aws-sdk');
const dynamo = new aws.DynamoDB.DocumentClient({ region: process.env.awsRegion });
const tableName = process.env.inventoryMeasuresTableName;
const uuidv1 = require('uuid/v1');

/**
 * Retrieve on measure record by id from Dynamo DB
 * @param {string} id
 * @return {Promise}
 */
function getMeasure(id) {
  return dynamo
    .get({
      Key: { id },
      TableName: tableName
    })
    .promise()
    .then((data) => data.Item);
}

/**
 * Get all the measures limited by pagination
 * TODO: pagination - apparently "Limit start, count" isn't supported in DynamoDB
 * @return {Promise}
 */
function listMeasures() {
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
 * Create a measure
 * @param {object} measure model instance
 * @return {Promise}
 */
function createMeasure(measure) {
  measure.id = uuidv1();
  return dynamo
    .put({
      TableName: tableName,
      Item: measure
    })
    .promise()
    .then(() => measure); // return what we just inserted
}

/**
 * Update a measure
 * @param {object} measure model instance
 * @return {Promise}
 */
function updateMeasure(measure) {
  return dynamo
    .put({
      TableName: tableName,
      Item: measure // ,
      // ReturnValues: 'ALL_NEW' DynamoDB.PutItem doesn't support ALL_NEW apparently
    })
    .promise()
    .then(() => measure); // so just send back the updated version
}

/**
 * Delete a measure
 * @param {string} id
 * @return {Promise}
 */
function deleteMeasure(id) {
  return dynamo
    .delete({
      Key: { id },
      TableName: tableName
    })
    .promise();
}

module.exports = {
  getMeasure,
  listMeasures,
  createMeasure,
  updateMeasure,
  deleteMeasure
};
