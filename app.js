var express       	 = require("express");
	app           	 = express();
	bodyParser    	 = require("body-parser");
	mongoose      	 = require("mongoose");
	methodOverride	 = require("method-override");
	expressSanitizer = require("express-sanitizer");

//var url = process.env.DATABASEURL || "mongodb://localhost:27017/restful_blog_app"

// mongoose.connect(url, {
// 	useNewUrlParser: true,
// 	useUnifiedTopology: true
// });

//APP CONFIG
// mongoose.connect("mongodb://localhost:27017/restful_blog_app", {
// 	useNewUrlParser: true,
// 	useUnifiedTopology: true
// });

mongoose.connect("mongodb+srv://RenataA:Renatarenata@cluster0.yqqfu.mongodb.net/RESTful_Blog_App?retryWrites=true&w=majority", {
	useNewUrlParser: true,
 	useUnifiedTopology: true
}).then(() => {
		console.log("Connected to DB!");
}).catch(err => {
	console.log("ERROR", err.message); 
})
					

mongoose.set('useFindAndModify', false);

app.set("view engine", "ejs");
app.use(express.static("public")); 
app.use(bodyParser.urlencoded({extended: true})); 
app.use(methodOverride("_method"));
app.use(expressSanitizer()); 


// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}	
});

var Blog = mongoose.model("Blog", blogSchema); 

// RESTFUL ROUTES
app.get("/", function(req, res){
	res.redirect("/blogs"); 
}); 

//INDEX ROUTE
app.get("/blogs", function(req, res){
	Blog.find({}, function(err, blogs){
		if(err){
			console.log("ERROR!"); 
		} else {
			res.render("index", {blogs: blogs}); 
		}
	}); 
}); 
//NEW ROUTE
app.get("/blogs/new", function(req, res){
	res.render("new");
});
//CREATE ROUTE 
app.post("/blogs", function(req, res){
	console.log(req.body);
	req.body.blog.body = req.sanitize(req.body.blog.body)
	console.log("==============");
	console.log(req.body);
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			res.render("new");
		} else {
			res.redirect("/blogs");
		}
	});
}); 

//SHOW ROUTE
app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.render("show", {blog: foundBlog});
		}
	});
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.render("edit", {blog: foundBlog});
		}
	});
});

//UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body)
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs/" + req.params.id);
		}
	});
}); 

//DELETE ROUTE 
app.delete("/blogs/:id", function(req, res){
	Blog.findByIdAndDelete(req.params.id, function(err){
		if(err){
			res.redirect("/blogs");  
		} else {
			res.redirect("/blogs"); 
		}
	});
}); 

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server is running!");
});


