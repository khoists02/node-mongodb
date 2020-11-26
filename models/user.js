const getDb = require('../util/database').getDb;
const mongoDb = require('mongodb');
const ObjectId = mongoDb.ObjectID;

class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart;
    this._id = id ? new ObjectId(id) : null;
  }

  save() {
    const db = getDb();

    return db.collection('users')
      .insertOne(this)
      .then(()=> console.log('Insert Success !'))
      .catch(err=> {
        throw err
      })
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex(cp=> {
      console.log({cp})
      return cp.productId.toString() === product._id.toString();
    });

    let newQuantity = 1;
    const updateCartItems = [...this.cart.items]

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updateCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updateCartItems.push({ productId: new ObjectId(product._id) , quantity: 1 })
    }

    const updateCart = {
      items: updateCartItems
    };

    const db = getDb();
    return db.collection('users')
      .updateOne({ _id: this._id }, { $set: { cart: updateCart } })
  }

  static findById(userId) {
    const db = getDb();
    return db.collection('users')
      .findOne({ _id: new ObjectId(userId) })
  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map(x=> x.productId);
    return db.collection('products')
      .find({ _id: { $in: productIds } })
      .toArray()
      .then(products=> {
        return products.map(p=> {
          return {...p, quantity: this.cart.items.find(i=> {
            return i.productId.toString() === p._id.toString();
            }).quantity
          };
        })
      })
  }

  deleteItemFromCart(productId) {
    const updatedCartItem = this.cart.items.filter(item=> {
      return item.productId.toString() !== productId.toString();
    })

    const db = getDb();
    return db.collection('users')
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: { items: updatedCartItem } } }
      )
  }
}

module.exports = User;
