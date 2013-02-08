Model.define('Class', {

	types: {
		_id : Object,
		name : String,
		sections : Array,
		requests : Array
	},

	static : {},
	methods : {},

	setters: {
		current : function(yours) {
			return yours;
		},

		requested : function(desired) {
			return desired;
		}
	}

	getters: {
		current : function(yours) {
			return yours;
		},

		requested : function(desired) {
			return desired;
		}
	}
});