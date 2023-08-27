const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const squadSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  selectedPlayers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Players" }],
});

const Selection = mongoose.model("CWCSquad", squadSchema);

module.exports = Selection;
