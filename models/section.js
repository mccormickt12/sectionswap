Model.define('Section', {

	types: {
		_id : Object,
		number : Number,
		time : String
	},

	static : {},
	methods : {},

	setters: {
		number : function(yours) {
			return yours;
		},

		time : function(desired) {
			return desired;
		}
	}

	getters: {
		number : function(yours) {
			return yours;
		},

		time : function(desired) {
			return desired;
		}
	}
});