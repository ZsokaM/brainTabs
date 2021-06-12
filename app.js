require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const flash = require("connect-flash");

const User = require("./models/User.model");

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() =>
    console.log(
      `Successfully connected to the database ${process.env.MONGODB_URI}`
    )
  )
  .catch((error) => {
    console.error(
      `An error ocurred trying to connect to the database ${process.env.MONGODB_URI}: `,
      error
    );
    process.exit(1);
  });

const indexRouter = require("./routes/index.routes");
const authRouter = require("./routes/auth.routes");
const userRouter = require("./routes/user.routes");

const app = express();

app.set("view engine", "hbs");

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
      sameSite: true,
      httpOnly: true,
      maxAge: 60000,
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 60 * 60 * 24,
    }),
  })
);

passport.serializeUser((user, done) => done(null, user._id));

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user) => done(null, user))
    .catch((err) => done(err));
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (email, password, done) => {
      User.findOne({ email })
        .then((user) => {
          if (!user) {
            return done(null, false, { message: "Incorrect email" });
          }

          if (!bcrypt.compareSync(password, user.password)) {
            return done(null, false, { message: "Incorrect password" });
          }

          return done(null, user);
        })
        .catch((err) => done(err));
    }
  )
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  res.locals.sessionUser = req.user;
  res.locals.tinyKey = process.env.TINY_KEY;
  next();
});

app.use("/", indexRouter);
app.use("/", authRouter);
app.use("/", userRouter);

app.listen(process.env.PORT, () => {
  console.log(`Listening on http://localhost:${process.env.PORT}`);
});

module.exports = app;
