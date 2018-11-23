'use strict';

const aws = require('aws-sdk');
const dynamo = new aws.DynamoDB.DocumentClient({ region: process.env.awsRegion });
const tableName = process.env.inventoryPeriodsTableName;
const uuidv1 = require('uuid/v1');

/**
 * Retrieve on period record by id from Dynamo DB
 * @param {string} id
 * @return {Promise}
 */
function getPeriod(id) {
  return dynamo
    .get({
      Key: { id },
      TableName: tableName
    })
    .promise()
    .then((data) => data.Item);
}

/**
 * Get all the periods limited by pagination
 * TODO: pagination - apparently "Limit start, count" isn't supported in DynamoDB
 * @return {Promise}
 */
function listPeriods() {
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
 * Create a period
 * @param {object} period model instance
 * @return {Promise}
 */
function createPeriod(period) {
  period.id = uuidv1();
  return dynamo
    .put({
      TableName: tableName,
      Item: period
    })
    .promise()
    .then(() => period); // return what we just inserted
}

/**
 * Update a period
 * @param {object} period model instance
 * @return {Promise}
 */
function updatePeriod(period) {
  return dynamo
    .put({
      TableName: tableName,
      Item: period // ,
      // ReturnValues: 'ALL_NEW' DynamoDB.PutItem doesn't support ALL_NEW apparently
    })
    .promise()
    .then(() => period); // so just send back the updated version
}

/**
 * Delete a period
 * @param {string} id
 * @return {Promise}
 */
function deletePeriod(id) {
  return dynamo
    .delete({
      Key: { id },
      TableName: tableName
    })
    .promise();
}

module.exports = {
  getPeriod,
  listPeriods,
  createPeriod,
  updatePeriod,
  deletePeriod
};
