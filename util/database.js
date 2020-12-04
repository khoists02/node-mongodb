const mongodb = require('mongodb');
const { COMMON } = require('../constants');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient
  .connect(COMMON.CONNECTION_STRING)
  .then((client)=> {
    console.log('✅ Mongodb connected!');
    _db = client.db(COMMON.DB_NAME);
    callback();
  })
  .catch(err=> {
    throw `🔴 ${err}`;
  })
}

const getDb = () => {
  if (_db) {
    return _db;
  }

  throw '🔴 No database found !';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

/**
 * 💪 Mongo connection string for compas
 * 💪 mongodb+srv://khoile:b1tzeq1VrXsa9YZU@cluster0.xbn2e.mongodb.net
 * 💪 Open MongoDb compas and pass it into your connection string and enjoy with your store data !
 */