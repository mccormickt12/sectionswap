Model.define('Request', {

	types: {
		_id : Object,
		email : String,
		current : Number,
		requested : Array
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