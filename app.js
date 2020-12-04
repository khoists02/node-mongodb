const path = require('path');
const User = require('./models/user');

// 👏🏻 Middleware supported !
const express = require('express');
const bodyParser = require('body-parser');

// 👏🏻 MongoConnection function
const { mongoConnect } = require('./util/database');

const app = express();

// 👏🏻 View parse
app.set('view engine', 'ejs');
app.set('views', 'views');

// 👏🏻 Routes function
const errorController = require('./controllers/error');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// 👏🏻 Middleware apply !
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Get the current user , we will replace it after handle authenticate with Oauth token !
app.use((req, res, next) => {
  User.findById('5fbf1a0791eeac0891bf435c')
      .then(user=> {
        if (user) {
          req.user = new User(user.username, user.email, user.cart, user._id);
        }
        
        // ✅ Push model User and all methods for req.user => 
        // example: req.user can use req.user.addToCart(product)
        next();
        // Middleware next function router !
      })
      .catch(err=> console.log(`🔴 ${err}`));
});

// 👏🏻  Routes apply !
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

// 👏🏻  Run app after make sure the mongo connected ! 
mongoConnect(()=> {
  console.log('✅ App listen port : http://localhost:3000/');
  app.listen(3000);
})