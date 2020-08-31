// 1. Dependencies, settings and initialise app ----------
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
//const exjwt = require("express-jwt");
const secretSalt = "iudbgiugvufygklmfyts5reswsdtygk";
const Utils = require("./Utils.js");
const port = process.env.PORT || 8081;
const app = express();

// 2. Middleware -----------------------------------------
// Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Enable CORS for all HTTP methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});
// json web token middleware
//const jwtMW = exjwt({ secret: secretSalt });

// 3. Database Connection --------------------------------
mongoose
  .connect(
    "mongodb://16d1c4790df1fbf93da272bc28c6f8c9:sunbug62@10a.mongo.evennode.com:27017/16d1c4790df1fbf93da272bc28c6f8c9",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    }
  )
  .then(() => {
    console.log("Connected to the mongodb");
  })
  .catch((err) => {
    console.log("Problem connectin to mongodb. Exiting now...", err);
    process.exit();
  });

// 4. Models ---------------------------------------------
let Car = require("./models/Car.js");
let User = require("./models/User.js");
let Review = require("./models/Review.js");
let Enquiry = require("./models/Enquiry.js");

// 5. Routes ---------------------------------------------

// Cars -----------------------------------
// cars - GET - get all Cars
app.get("/api/cars", (req, res) => {
  if (req.query.ids) {
    let idsArray = req.query.ids.split(",");
    console.log(idsArray);
    Car.find({
      _id: {
        $in: idsArray
      }
    })
      .then((cars) => {
        if (!cars) {
          res.status(400).send({ msg: "No Cars found" });
        } else {
          res.json(cars);
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          msg: "this one",
          error: err.message
        });
      });
  } else if (req.query.brand) {
    Car.find({ brand: req.query.brand })
      .then((cars) => {
        if (!cars) {
          res.status(400).send({ msg: "No Cars found" });
        } else {
          res.json(cars);
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          msg: "Problem finding cars",
          error: err.message
        });
      });
  } else {
    Car.find({})
      .then((cars) => {
        if (!cars) {
          res.status(400).send({ msg: "No Cars found" });
        } else {
          res.json(cars);
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          msg: "Problem finding cars",
          error: err.message
        });
      });
  }
});

// Cars - GET - get single by id
app.get("/api/cars/:id", (req, res) => {
  Car.findById(req.params.id)
    .then((car) => {
      if (!car) {
        res.status(404).send("Car not found");
      } else {
        res.json(car);
      }
    })
    .catch((err) => {
      console.log(err);
      res.send({
        msg: "Problem getting Car",
        error: err.message
      });
    });
});

// Reviews - PUT - update a single car
app.put("/api/cars/:id", (req, res) => {
  // validate request
  if (!req.body) {
    return res.status(400).send("Problem booking car - bad request");
  } else {
    // update car
    Car.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then((car) => {
        res.json(car);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          msg: "Problem booking car",
          error: err.message
        });
      });
  }
});

// Users ------------------------------
// Users - GET - all
app.get("/api/users", (req, res) => {
  User.find({})
    .then((users) => {
      if (!users) {
        res.status(400).send({ msg: "No users found" });
      } else {
        res.json(users);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        msg: "Problem finding users",
        error: err.message
      });
    });
});

// Users - GET - get single by id
app.get("/api/users/:id", (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(404).send("User not found");
      } else {
        res.json(user);
      }
    })
    .catch((err) => {
      console.log(err);
      res.send({
        msg: "Problem getting user",
        error: err.message
      });
    });
});

// Users - POST - create new user
app.post("/api/users", (req, res) => {
  // validate request
  if (!req.body) {
    res.status(400).send({ msg: "User content can not be empty" });
  } else {
    // create new user
    let newUser = new User(req.body);
    newUser
      .save()
      .then((user) => {
        res.status(201).json(user);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          msg: "Couldn't create user",
          error: err.message
        });
      });
  }
});

// Users - PUT - update a user
app.put("/api/users/:id", (req, res) => {
  // validate request
  if (!req.body) {
    return res.status(400).send("User content can not be empty");
  } else {
    // update user
    User.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          msg: "Problem updating user",
          error: err.message
        });
      });
  }
});

// Users - DELETE - delete a Book
app.delete("/api/users/:id", (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then((user) => {
      res.send({ msg: "User deleted" });
    })
    .catch((err) => {
      res.status(500).send({
        msg: "Problem deleting user",
        error: err.message
      });
    });
});

// Reviews - GET - get all reviews with corresponding car id
app.get("/api/reviews", (req, res) => {
  console.log(req.query);
  Review.find(req.query)
    .then((reviews) => {
      if (!reviews) {
        res.status(400).send({ msg: "No Reviews found" });
      } else {
        res.json(reviews);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        msg: "Problem finding reviews",
        error: err.message
      });
    });
});

// Reviews - POST - create new review
app.post("/api/reviews", (req, res) => {
  // validate request
  if (!req.body) {
    res.status(400).send({ msg: "Review content can not be empty" });
  } else {
    // create new review
    let newReview = new Review(req.body);
    newReview
      .save()
      .then((review) => {
        res.status(201).json(review);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          msg: "Couldn't create review",
          error: err.message
        });
      });
  }
});

// Reviews - PUT - update a single review
app.put("/api/reviews/:id", (req, res) => {
  // validate request
  if (!req.body) {
    return res.status(400).send("Review content can not be empty");
  } else {
    // update user
    Review.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then((review) => {
        res.json(review);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          msg: "Problem updating review",
          error: err.message
        });
      });
  }
});

// Reviews - DELETE - delete a single review
app.delete("/api/reviews/:id", (req, res) => {
  console.log(req.params.id);
  Review.findByIdAndRemove(req.params.id)
    .then((review) => {
      res.send({ msg: "Review deleted" });
    })
    .catch((err) => {
      res.status(500).send({
        msg: "Problem deleting review",
        error: err.message
      });
    });
});

// Enquiries - POST - create a new enquiry
app.post("/api/enquiries", (req, res) => {
  // validate request
  if (!req.body) {
    res.status(400).send({ msg: "Enquiry content can not be empty" });
  } else {
    // create new enquiry
    let newEnquiry = new Enquiry(req.body);
    newEnquiry
      .save()
      .then((enquiry) => {
        res.status(201).json(enquiry);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          msg: "Couldn't create enquiry",
          error: err.message
        });
      });
  }
});

// Auth ----------------------------------------------
// Auth - signIN
app.post("/api/auth/login", (req, res) => {
  if (!req.body.email | !req.body.password) {
    res.status(400).json({
      message: "No email / password provided"
    });
    return;
  }
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user == null) {
        res.status(400).json({
          message: "No account found"
        });
        return;
      }
      if (Utils.verifyHash(req.body.password, user.password)) {
        let token = jwt.sign(
          {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email
          },
          secretSalt,
          { expiresIn: 60 * 60 }
        );
        user.password = undefined;

        res.json({
          token: token,
          user: user
        });
      } else {
        res.status(400).json({
          message: "Email / password is incorrect"
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Problem finding user",
        err: err
      });
    });
});

// Auth - validate -----------------------------------
app.get("/api/auth/validate", (req, res) => {
  let token = req.headers["authorization"].split(" ")[1];
  jwt.verify(token, secretSalt, (err, authData) => {
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
      res.json({
        user: authData
      });
    }
  });
});

// 6. Run server on port -----------------------------
app.listen(port, () => {
  console.log(`running on port ${port}`);
});
