const path = require("path");
const express = require("express");
const exphbs = require("express-handlebars");
const routes = require("./controllers");
const helpers = require("./utils/helpers");
const sequelize = require("./config/connection");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 3001;

const sess = {
  secret: "red soup",
  resave: false,
  cookie: {
    // secure: true, //delete this if still doesn't work
    path: "/",
    maxAge: 60 * 60 * 1000,
    signed: false,
  },
  saveUninitialized: true,
};

app.use(session(sess));

const hbs = exphbs.create({ helpers });

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log("Now listening"));
});
