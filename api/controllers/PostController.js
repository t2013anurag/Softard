/**
 * PostController
 *
 * @description :: Server-side logic for managing posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	'createpost' : function(req, res) {		
		if(req.session.authenticated) {
			var author = req.session.User.name;
			var username = req.session.User.username;
			var title = req.param('title');
			var shortdesc = req.param('shortdesc');
			var longdesc = req.param('longdesc');
			var steps  = req.param('steps');
			var category = req.param('category');
			var tags = req.param('tags');
			steps = JSON.parse(steps); // steps are passed as json objects in url
			if(!title) {
				var reply = {
					'status' : 201,
					'message': 'Post could not be created'
				};
				res.status(200).json(reply);
			} else {
				Post.create({
					'username' : username,
					'author' : author,
					'title'	: title,
					'shortdesc': shortdesc,
					'longdesc' : longdesc,
					'steps' : steps,
					'category' : category,
					'tags' : tags
				}, function postCreated(err, post){
					if(err) {
						var reply = {
							'status' : 202,
							'message' : 'An error ocurred while creating the post'
						};
						res.status(200).json(reply);
						return;
					} else {
						var token = req.session.id;
						var reply = {
							'username' : username,
							'author' : author,
							'title'	: title,
							'shortdesc': shortdesc,
							'longdesc' : longdesc,
							'steps' : steps,
							'category' : category,
							'tags' : tags,
							'token' : token
						};
						res.status(200).json(reply);
					}
				});
			}
		} else {
			var reply = {
				'status' : 200,
				'message' : 'The user session is invalid'
			};
			res.status(200).json(reply);
		}
	},


	viewall : function(req, res) {
		var allposts = [];
		var length = 0;
		Post.find().populateAll().exec(function foundPost(err, post){
			if(err) {
				var reply = {
					'status' : 203,
					'message' : 'An error occured while viewing the posts'
				};
				res.status(200).json(reply);
			} else {
				_.each(post, function(post){
					allposts.push(post);
					length++;
				});
				viewresponse(allposts,length);
			}
		});

		function viewresponse(allposts, length) {
			var reply = {
				'status' : 204,
				'message' : 'All the posts have been fetched',
				'totalposts' : length,
				'post' : allposts
			};
			res.status(200).json(reply);
		}
	}	
};

