const express = require('express');
const session = require('express-session');
const { ExpressOIDC } = require('@okta/oidc-middleware');
const path = require('path');

const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const oidc = new ExpressOIDC({
  issuer: 'https://tkirk.oktapreview.com/oauth2/auslkqbnk1Xqo73k70h7',
  client_id: '0oap4m8z1iLVCWcug0h7',
  client_secret: 'F_TsZu7NUlp7wnhTuyZ3wr1FVltUsPCBoZR420Sa',
  appBaseUrl: 'http://localhost:3000',
  scope: 'openid profile',
  routes: {
    login: {
      viewHandler: (req, res, next) => {
        // Render your custom login page, you must create this view for your application and use the Okta Sign-In Widget
        res.render('index', {
          csrfToken: req.csrfToken(),
          baseUrl: "https://tkirk.oktapreview.com",
          cdnUrl: "https://global.oktacdn.com/okta-signin-widget/2.19.0"
        });
      }
    }
  }
});

app.use(session({
  secret: 'this-should-be-very-random',
  resave: true,
  saveUninitialized: false
}));
app.use(oidc.router);

app.get('/', (req, res) => {
  if (req.userContext) {
    res.send(`
      Hello ${req.userContext.userinfo.name}!
      <form method="POST" action="/logout">
        <button type="submit">Logout</button>
      </form>
    `);
  } else {
    res.send('Please <a href="/login">login</a>');
  }
});

app.get('/protected', oidc.ensureAuthenticated(), (req, res) => {
  res.send('Top Secret');
});

// oidc.on('ready', () => {
//   app.listen(3000, () => console.log('app started'));
// });

oidc.on('error', err => {
  // An error occurred while setting up OIDC, during token revokation, or during post-logout handling
});

module.exports = app


