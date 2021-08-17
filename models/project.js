const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate");

const CourseSchema = Schema({
  title: String,
  link: String,
  description: String
});
CourseSchema.plugin(mongoosePaginate);

module.exports= mongoose.model("Project", CourseSchema);