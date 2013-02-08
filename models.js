var mongoose = require('mongoose');
db = mongoose.connect('mongodb://localhost/');
var init = function() {
	var schema = {
		course : new mongoose.Schema({
			dept : String,
			num : String,
			all_requests : Array
		})
	}

	var dema = {
		request : new mongoose.Schema({
			curr : Number,
			desired : Number
		})
	}

	var middle = {
		Class : mongoose.model("Class", schema.course),
		Request : mongoose.model("Request", dema.request)
	}
	return middle;
}
module.exports = init;