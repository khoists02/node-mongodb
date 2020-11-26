const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const mongoConnect = require('./util/database').mongoConnect;

const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const User = require('./models/user');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

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

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(()=> {
  console.log('✅ App listen port : http://localhost:3000/');
  app.listen(3000);
})