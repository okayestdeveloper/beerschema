'use strict';

const aws = require('aws-sdk');
const dynamo = new aws.DynamoDB.DocumentClient({ region: process.env.awsRegion });
const tableName = process.env.inventoryVendorsTableName;
const uuidv1 = require('uuid/v1');

/**
 * Retrieve on vendor record by id from Dynamo DB
 * @param {string} id
 * @return {Promise}
 */
function getVendor(id) {
  return dynamo
    .get({
      Key: { id },
      TableName: tableName
    })
    .promise()
    .then((data) => data.Item);
}

/**
 * Get all the vendors limited by pagination
 * TODO: pagination - apparently "Limit start, count" isn't supported in DynamoDB
 * @return {Promise}
 */
function listVendors() {
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
 * Create a vendor
 * @param {object} vendor model instance
 * @return {Promise}
 */
function createVendor(vendor) {
  vendor.id = uuidv1();
  return dynamo
    .put({
      TableName: tableName,
      Item: vendor
    })
    .promise()
    .then(() => vendor); // return what we just inserted
}

/**
 * Update a vendor
 * @param {object} vendor model instance
 * @return {Promise}
 */
function updateVendor(vendor) {
  return dynamo
    .put({
      TableName: tableName,
      Item: vendor // ,
      // ReturnValues: 'ALL_NEW' DynamoDB.PutItem doesn't support ALL_NEW apparently
    })
    .promise()
    .then(() => vendor); // so just send back the updated version
}

/**
 * Delete a vendor
 * @param {string} id
 * @return {Promise}
 */
function deleteVendor(id) {
  return dynamo
    .delete({
      Key: { id },
      TableName: tableName
    })
    .promise();
}

module.exports = {
  getVendor,
  listVendors,
  createVendor,
  updateVendor,
  deleteVendor
};
