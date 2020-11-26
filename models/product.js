const getDb = require('../util/database').getDb;
const mongoDb = require('mongodb');
const ObjectId = mongoDb.ObjectID;

class Product {
  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new ObjectId(id) : null;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      dbOp = db.collection('products').updateOne({ _id: mongoDb.ObjectID(this._id) },
        {$set: this });
    } else {
      dbOp = db.collection('products')
      .insertOne(this)
    }

    return dbOp.then(result=> {
      // console.log({result});
    })
    .catch(err=> {
      throw err;
    })
  }

  static fetchAll() {
    const db = getDb();

    return db.collection('products')
                .find()
                .toArray()
                .then((products)=> {
                  return products;
                })
                .catch(err=> {
                  throw err;
                })
  }

  static findById(prodId) {
    const db = getDb();

    return db.collection('products')
              .find({ _id: mongoDb.ObjectID(prodId) })
              .next()
              .then(product=> {
                return product;
              })
              .catch(err=> {
                throw err;
              })
  }

  static deleteById(prodId) {
    const db = getDb();

    return db.collection('products')
      .deleteOne({ _id: new mongoDb.ObjectID(prodId) })
      .then(()=> console.log('Deleted !'))
      .catch(err=> {
        throw err;
      });

  }
}

module.exports = Product;
