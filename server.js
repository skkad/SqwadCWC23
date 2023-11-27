const express = require("express");
const Joi = require("joi");
// Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const Players = require("./models/PlayersModel");
const User = require("./models/UserModel");
const Selection = require("./models/CWCSquadModel");
const validateUser = require("./middleware/validateUser");
const validateLogin = require("./middleware/auth");
const app = express();
app.use(express.json());

/* User registraion apis */

// login and sign up apis
app.post("/user-signup", async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ error: "That user already exists!" });
    }

    user = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    await user.save();

    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.post("/user-login", async (req, res) => {
  try {
    // First Validate The Request
    const { error } = validateLogin(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    //  Now find the user by their email address
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send("Incorrect email or password.");
    }

    // Then validate the Credentials in MongoDB match
    // those provided in the request
    // const validPassword = await bcrypt.compare(req.body.password, user.password);
    const validPassword = user.password === req.body.password;
    if (!validPassword) {
      return res.status(400).send("Incorrect email or password.");
    }
    // res.send(true);
    res
      .status(200)
      .json({ message: "User loged In successfully", response: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});
/* User registraion apis */

/* user squad */

// selection api
app.post("/selection", async (req, res) => {
  try {
    const { userId, selectedPlayersId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const selectedPlayers = await Players.find({
      _id: { $in: selectedPlayersId },
    });
    // .populate("selectedPlayers")
    // .exec();
    const uniqueId = await Selection.findOne({ user: userId });
    if (uniqueId && uniqueId.selectedPlayers.length === 15) {
      return res
        .status(400)
        .json({ message: "User has already submitted a selection team" });
    } else {
      const newSelection = new Selection({
        user: userId,
        selectedPlayers: selectedPlayers.map((player) => player._id),
        // selectedPlayers: selectedPlayers.map((player) =>
        //   Selection.findById(player._id).populate("selectedPlayers").exec()
      });

      const savedSelection = await newSelection.save();
      res.status(200).json({
        message: "Selection saved successfully",
        selection: savedSelection,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Selection failed", error: err.message });
  }
});

// get api
app.get("/mySquad", async (req, res) => {
  try {
    const id = req.query.userId;

    if (!id) {
      return res.status(404).json({ message: "User not found" });
    } else {
      const players = await Selection.find({ user: id });

      // let data = [];

      // players.forEach((p) => {
      //   let data = Selection.find({ id: p });
      //   console.log(data);
      //   data.push(data);
      // });

      // .populate("selectedPlayers")
      // .exec();
      console.log("list of selection:", players);
      // const squad = players.filter((player) => player.user === id);
      // const selectedPlayers = players.selectedPlayers.map((item) =>
      //   Players.findById(item).populate().exec()
      // );
      res.status(200).json({
        message: "Success",
        response: players,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Oops", error: err.message });
  }
});

// api for getting player details selected

/* user squad */

/* Players details collecetion apis */

// post players data
app.post("/upload", async (req, res) => {
  try {
    const player = await Players.create(req.body);
    res.status(200).json({ message: "Success", response: player });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// get players data
app.get("/allPlayers", async (req, res) => {
  try {
    const players = await Players.find();
    res
      .header("Access-Control-Allow-Origin", "*")
      .header("Access-Control-Allow-Headers", "Content-Type")
      .status(200)
      .json({ message: "Success", count: players.length, response: players });
  } catch (error) {
    res
      .header("Access-Control-Allow-Origin", "*")
      .header("Access-Control-Allow-Headers", "Content-Type")
      .status(500)
      .json({ message: error.message });
  }
});
// filters players by roles
app.get("/single", async (req, res) => {
  try {
    // const { role } = req.params;
    // const players = await Players.find(role);
    // res.status(200).json({ message: "Success", response: players });
    const role = req.query.role;
    const players = await Players.find();
    if (role !== "") {
      console.log("1", role);
      // console.log("2", players);
      const usersWithRole = players.filter((user) => user.role === role);
      if (usersWithRole.length > 0) {
        res.status(200).json({ message: "Success", response: usersWithRole });
      } else {
        res
          .status(404)
          .json({ message: `No players found with role: ${role}` });
      }
    } else {
      res.status(200).json({ message: "No Data", response: usersWithRole });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* Players details collecetion apis */

mongoose
  .connect(
    // "mongodb+srv://Newton:NewtonDB1998@cluster0.wpsflje.mongodb.net/CRUD?retryWrites=true&w=majority"
    "mongodb+srv://SquadCWC:Bccisucks2023@cluster0.wpsflje.mongodb.net/SquasCWC?retryWrites=true&w=majority"
  )
  .then(
    () => (
      console.log("Connected! to mongodb "),
      app.listen(5000, () => {
        console.log("localhost 5000 is live");
      })
    )
  )
  .catch((err) => console.log(err));
