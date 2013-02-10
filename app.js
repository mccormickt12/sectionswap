
/**
 * Module dependencies.
 */

var express = require('express')
  , helpers = require('express-helpers')()
  , http = require('http')
  , path = require('path')
  , model = require('./models.js')()
  , XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;



var app = express();

app.locals({
  link_to : helpers.link_to
});

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function(req, res) {
  model.Class.find({}, function(err, course) {
    if (err) {
      res.json(404);
    } else {
      res.render("index", { 
        courses: course,
        title: "This is title"
      });
    }
  });
});

app.get('/all', function(req, res){
  var allClasses = model.Class.find({}, function(err, course) {
    if (err) {
      res.json(404);
    } else {
      res.render("all", { courses: course });
    }
  });
});

app.post('/', function(req, res){
  var newClass = new model.Class({
    dept : req.param('dept'),
    num : req.param('num'),
    all_requests : []
  });
  newClass.save(function(err, post) {
      if (err) {
        res.send(500);
      } else {
        post.toJSON();
      }
  });
   req.method = 'get';
   res.redirect('/');
});

app.get('/:dept/:num', function(req, res) {
  model.Class.findOne(
    { 
      dept: req.params.dept,
      num: req.params.num
     }, function(err, course) {
      if (err) {
      res.json(404);
    } else {
      res.render("course", { 
        title: "Current Section",
        course: course,
        sections : getJson(req.params.dept,  req.params.num)
      });
    }
  });
});

app.post('/:dept/:num', function(req, res) {
  var newReq = new model.Request({
    curr : req.param('section'),
    desired : 0
  });
  model.Class.findOne(
    { 
      dept: req.params.dept,
      num: req.params.num
     }, function(err, course) {
      course.all_requests.push(newReq);
      course.save();
      req.method = 'get';
      res.redirect('/' + req.params.dept + '/' + 
      req.params.num + '/desired');
    });
});

app.get('/:dept/:num/desired', function(req, res) {
  model.Class.findOne(
    { 
      dept: req.params.dept,
      num: req.params.num
     }, function(err, course) {
      if (err) {
      res.json(404);
    } else {
      res.render("course", { 
        title: "Desired Sections",
        course: course,
        sections : getJson(req.params.dept,  req.params.num)
      });
    }
  });
});

app.post('/:dept/:num/desired', function(req, res) {
  model.Class.findOne(
    { 
      dept: req.params.dept,
      num: req.params.num
     }, function(err, course) {
      var item = course.all_requests.pop();
      item.desired = req.param('section');
      item.curr = item.curr.toString();
      course.all_requests.push(item);
      course.save();
      req.method = 'get';
      res.redirect('/' + req.params.dept + '/' + 
      req.params.num + '/finished');
    });
});

 
app.get('/:dept/:num/finished', function(req, res) {
  model.Class.findOne(
    { 
      dept: req.params.dept,
      num: req.params.num
     }, function(err, course) {
      if (err) {
      res.json(404);
    } else {
      var all = course.all_requests
      var newest = course.all_requests[course.all_requests.length - 1];
      var first = all[0];
      var cyc = findCycle(newest, null, course, []);
      res.render("finished", {
        cycle : cyc
      });
    }
  });
});


function findCycle(orig, new_match, db, path) {
  var all = db.all_requests;
  var checked = new_match;
  if (orig == new_match) {
    console.log("EQUALS!!!");
    path.push(new_match);
    path.push("END");
    return path;
  }
  if (new_match == null) {
      checked = orig;
  } else {
      checked = new_match;
  }
  if (path.indexOf("null") == 0) {
    path = [];
  }
  for (var i = 0; i < all.length; i++) {
    var req = all[i];
    if (req.curr == checked.desired) {
      var arr = findCycle(orig, req, db, path);
      console.log(arr);
      if (arr.indexOf("null") == -1) {
        console.log("no null");
        path.push(checked);
        path.push("END");
        return arr;
      } else {
        console.log("contains null end");
        continue;
      }
    }
  }
  console.log("found no matches");
  path.push('null');
  return path;
}


function getJson(dept, num) {
  var theUrl = "https://apis-dev.berkeley.edu/cxf/asws/classoffering/"
    + dept + "." +  num  + 
    ".SPRING.2013?_type=json&app_id=5b0e1bb8&app_key=53775bde1744f221dcf194a55b49e640";
  var xmlHttp = null;
  xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", theUrl, false );
  xmlHttp.send( null );
  return JSON.parse(xmlHttp.responseText || "null");
}

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
