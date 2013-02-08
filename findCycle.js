var init = function() {


function findCycle(orig, req, db, path) {
	 console.log("  ");
      console.log("  ");
      console.log(path);
	if (orig == req) {
		return path;
	}
	path.push(req);
	console.log(db);
	for (var a in db) {
		if (a.desired == req.curr) {
			var arr = findCycle(orig, a, db, path);
			if (arr.indexOf("null") == -1) {
				continue;
			} else {
				return arr;
			}
		}
	}
	path.push('null');
	return path;
}

return findCycle;

}
module.exports = init;