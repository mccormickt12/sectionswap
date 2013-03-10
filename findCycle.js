var init = function() {


	function wants(first, second) {
	  return first.curr == second.desired && first.desired == second.curr;
	}

	function combine(a, b) {
	  var finished = [];
	  for (var i = 0; i < a.length; i++) {
	    finished.push(a[i]);
	  }
	  for (var i = 0; i < b.length; i++) {
	    finished.push(b[i]);
	  }
	  prints(finished);
	  return finished;
	}

	function combine_change(a, b) {
	  for (var i = 0; i < b.length; i++) {
	    a.push(b[i]);
	  }
	  prints(a);
	  return a;
	}

	function prints(a) {
	  for (var i = 0; i < a.length; i++) {
	    console.log(JSON.stringify(a[i]));
	  }
	  console.log("");
	}


	function findCycle(orig, current, path, db) {
	  //returns a path
	  //pass in current on initial call
	  var all = db.all_requests;
	  if (current.desired == orig.curr) {
	    combine_change(path, ["end"]);
	    return path;
	  }
	  for (var i = 0; i < all.length; i++) {
	    var request = all[i];
	    if (wants(orig, request)) {
	      return [orig, request, "end"];
	    }
	    if (request.curr == current.desired) {
	      var new_path = combine(path, [request]);
	      prints(path);
	      console.log("");
	      new_path =  findCycle(orig, request, new_path, db);
	      if (new_path.indexOf("null") != -1) {
	        continue;
	      } else if (new_path.indexOf("end") == (new_path.length - 1)) {
	        return new_path;
	      }
	    } else {
	      continue;
	    }
	  }
	  return ["null"];
	}


	return findCycle;

	}
module.exports = init;





















