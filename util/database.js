const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient
  .connect(
    'mongodb+srv://khoile:b1tzeq1VrXsa9YZU@cluster0.xbn2e.mongodb.net/shop?retryWrites=true&w=majority'
  )
  .then((client)=> {
    console.log('Mongodb connected !');
    _db = client.db('test');
    callback();
  })
  .catch(err=> {
    throw err;
  })
}

const getDb = () => {
  if (_db) {
    return _db;
  }

  throw 'No database found !';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

/**
 * Mongo connection string for compas
 * 
 * mongodb+srv://khoile:b1tzeq1VrXsa9YZU@cluster0.xbn2e.mongodb.net
 */