const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let PlayersSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    require: true,
  },
  role: {
    type: String,
    require: true,
  },
  score: {
    type: Number,
    require: true,
  },
  fifty: {
    type: Number,
    require: false,
  },
  hundred: {
    type: Number,
    require: false,
  },
  matches: {
    type: Number,
    require: true,
  },
  innings: {
    type: Number,
    require: true,
  },
  sr: {
    type: Number,
    require: false,
  },
  avg: {
    type: Number,
    require: false,
  },
  wickets: {
    type: Number,
    require: false,
  },
  economy: {
    type: Number,
    require: false,
  },
});

const Players = mongoose.model("PlayersSchema", PlayersSchema);
module.exports = Players;
