var mongoose = require("mongoose");

var TodoSchema = new mongoose.Schema({
  text: String,
  status: String,
  completionDate: Date,
  createdDate: { type: Date, default: Date.now },
  parentTodo: { type: mongoose.Schema.Types.ObjectId, ref: "Todo" },
});

module.exports = mongoose.model("Todos", TodoSchema);
