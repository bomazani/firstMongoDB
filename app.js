const MongoClient = require('mongodb').MongoClient;
//  const Mongo = require('mongodb');
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'firstMongoDB';

// Use connect method to connect to the server
MongoClient.connect(url, function (err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  // calling code 1 here //
  insertDocuments(db, function () {
    // calling code 5 here //
    indexCollection(db, function () {
      // calling code 2 here //
      findDocuments(db, function () {
        // calling code 3 here //
        updateDocument(db, function () {
          // calling code 4 here //
          removeDocument(db, function () {
            client.close();
          });
        });
      });
    });
  });
});



//  adding additional code 1, here //
// the following function uses the insertMany method 
// to add three documents to the documents collection.
const insertDocuments = function (db, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Insert some documents
  collection.insertMany([
    { a: 1 }, { a: 2 }, { a: 3 }
  ], function (err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the collection");
    callback(result);
  });
}

// adding additional code 2, here //
// This query returns all the documents in the documents collection. Add the findDocument method to the MongoClient.connect callback:
// const findDocuments = function (db, callback) {
//   // Get the documents collection
//   const collection = db.collection('documents');
//   // Find some documents
//   collection.find({}).toArray(function (err, docs) {
//     assert.equal(err, null);
//     console.log("Found the following records");
//     console.log(docs)
//     callback(docs);
//   });
// }

// Add a query filter to find only documents which meet the query criteria.
// Only the documents which match 'a' : 3 should be returned.
const findDocuments = function (db, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Find some documents
  collection.find({ 'a': 3 }).toArray(function (err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs);
    callback(docs);
  });
}

//  adding additional code 3, here //
// The method updates the first document where the field a is equal to 2
// by adding a new field b to the document set to 1.
const updateDocument = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Update document where a is 2, set b equal to 1
  collection.updateOne({ a : 2 }
    , { $set: { b : 1 } }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Updated the document with the field a equal to 2");
    callback(result);
  });  
}

//  adding additional code 4, here //
// Remove the document where the field a is equal to 3.
const removeDocument = function (db, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Delete document where a is 3
  collection.deleteOne({ a: 3 }, function (err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Removed the document with the field a equal to 3");
    callback(result);
  });
}

//  adding additional code 5, here //
// Indexes can improve your application’s performance. 
// The following function creates an index on the a field in the documents collection.
const indexCollection = function (db, callback) {
  db.collection('documents').createIndex(
    { "a": 1 },
    null,
    function (err, results) {
      console.log(results);
      callback();
    }
  );
};

