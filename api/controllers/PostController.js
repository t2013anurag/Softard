/**
 * PostController
 *
 * @description :: Server-side logic for managing posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	'createpost' : function(req, res) {		
		// if(req.session.authenticated) {
			var title = req.param('title');
			title = title.replace(/-/g, " ");
			var shortdesc = req.param('shortdesc');
			shortdesc = shortdesc.replace(/-/g, " ");
			var allsteps = req.param('allsteps');
			allsteps = allsteps.replace(/@@/g,' ');
			var platform = req.param('platform');
			var tag = req.param('tags');
			var tags = [];
			tags = tag.split(",");
			var username = req.param('username');
			var author = req.param('name');
			author = author.replace(/-/g," ");

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
					'steps' : allsteps,
					'platform' : platform,
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
						var id = post.id;
						var response = {
							'username' : username,
							'author' : author,
							'title'	: title,
							'shortdesc': shortdesc,
							'steps' : allsteps,
							'platform' : platform,
							'tags' : tags,
							'id' : post.id
						};
						addPostToUserBucket(id, username, response); // A function to add the postid to the user author array
					}
				});
			}
		// } else {
		// 	var reply = {
		// 		'status' : 200,
		// 		'message' : 'The user session is invalid'
		// 	};
		// 	res.status(200).json(reply);
		// }

		function addPostToUserBucket(id, username, response) { // here id = id of post created, user = user information, response = previous response
			
			 User.findOneByUsername(username, function foundUser(err, user){
			 	if(err) {
			 		var reply = {
			 			'status' : 300,
			 			'message' : 'An error occured while creating the post and adding to user bucket'
			 		};
			 		res.status(200).json(reply);
			 	} else {
			 		var authorofposts = user.authorofposts;
			 		authorofposts.push(id);
			 		User.update({'username' : username},{'authorofposts' : authorofposts}, function updatedUser(err, user){
			 			if(err) {
			 				var reply = {
			 					'status' : 301,
			 					'message' : 'An error occured while updating author bucket'
			 				};
			 				res.status(200).json(reply);
			 			} else {
			 				var reply = {
			 					'status' : 302,
			 					'message' : 'successfully updated user bucket',
			 					'user' : user,
			 					'post' : response
			 				};
			 				res.status(200).json(reply);
			 			}
			 		});
			 	}
			 });
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
	},

	viewpostbyauthor : function(req, res) {
		var username = req.param('username');
		Post.find().where({'username' : username}).exec(function foundUser(err, post){
			if(err) {
				var reply = {
					'status' : 205,
					'message' : 'The post could not be fetched'
				};
				res.status(200).json(reply);
			}
			if(!post) {
				var reply = {
					'status' : 206,
					'message' : 'The post with this id does not exist'
				};
				res.status(200).json(reply);
			} else {
				var reply = {
					'status' : 207,
					'message' : 'The post has been fetched successfully',
					'post' : post				
				}
				res.status(200).json(reply);
			}
		});
	},

	viewpostbyid : function(req, res) {
		var id = req.param('id');
		Post.findOne(id, function foundPost(err, post){
			if(err) {
				var reply = {
					'status' : 205,
					'message' : 'The post could not be fetched'
				};
				res.status(200).json(reply);
			}
			if(!post) {
				var reply = {
					'status' : 206,
					'message' : 'The post with this id does not exist'
				};
				res.status(200).json(reply);
			} else {
				var reply = {
					'status' : 207,
					'message' : 'The post has been fetched successfully',
					'post' : post				
				}
				res.status(200).json(reply);
			}
		});
	},


	'edit' : function(req, res) {
		var count = 0 ;
		var title = req.param('title');
		var shortdesc = req.param('shortdesc');
		// var longdesc = req.param('longdesc');
		var steps  = req.param('allsteps');
		var platform = req.param('platform');
		var tags = req.param('tags');
		var postid = req.param('id');
		var username = req.param('username');
		var author = req.param('name');
		var id = postid;
		User.findOneByUsername(username, function foundUser(err, user){
		 	if(err) {
		 		var reply = {
		 			'status' : 300,
		 			'message' : 'The user not found'
		 		};
		 		res.status(200).json(reply);
		 	} 
		 	if(!user) {
		 		var reply = {
		 			'status' : 301,
		 			'message' : 'User not found'
		 		};
		 		res.status(200).json(reply);
		 	} else {
		 		var authorofposts = user.authorofposts;
		 		_.each(authorofposts, function(findId){
					if(findId === postid) {
				 		count++;
				 	}
		 		});
		 				 	if(count > 0) {
				Post.findOne(id, function foundPost(err, post){
					if(err) {
						var reply = {
							'status' : 210,
							'message' : 'An error occured while finding the post to edit'
						};
						res.status(200).json(reply);
					}
					if(!post) {
						var reply = {
							'status' : 211,
							'message' : 'No such post exist with this id'
						};
						res.status(200).json(reply);
					} else {
						Post.update(id, {'title' : title, 'shortdesc' : shortdesc, 'steps' : steps, 'platform' : platform,'tags' : tags}, function postEdited(err, post){
							if(err) {
								var reply = {
									'status' : 212,
									'message' : 'Oops, an error occured while editing the post'
								};
								res.status(200).json(reply);
							} else {
								var reply = {
									'status' : 213,
									'message' : 'The post has been updated successfully',
									'post' : post
								};
								res.status(200).json(reply);
								return;
							}									
						});
					}
				});
			} else {
				var reply = {
					'status' : 214,
					'message' : 'You are not the author of this post'
				};
				res.status(200).json(reply);
		 		}
		 	}		 	
		});
	},

	'delete' : function(req, res) {
		if(req.session.authenticated) {
			var id = req.param('id');
			var username = req.param('username');
			var user = req.param('user');
			console.log(user);
			var authorofposts = req.session.User.authorofposts;
			var user = req.session.User;
			var count = 0;
			_.each(authorofposts, function(findId){
				if(findId === id) {
					count++;
				}
			});
			if(count > 0) {
				Post.destroy({id : id}).exec(function (err){
					if(err) {
						var reply = {
							'status' : 218,
							'message' : 'An error occured while deleting the post'
						};
						res.status(200).json(reply);
					} else {
						var response = {
							'message' : 'The post has been deleted successfully'
						};
						updateUserAuthorOfPosts(user, id, response);//function to update authorofposts array
					}
				});
			} else {
				var reply = {
					'status' : 217,
					'message' : 'The post does not exist'
				};
				res.status(200).json(reply);
			}
		} else {
			var reply = {
				'status' : 216,
				'message' : 'Unable to delete post please login and try again'
			};
			res.status(200).json(reply);
		}

		function updateUserAuthorOfPosts(user, id, response) {
			var authorofposts = user.authorofposts;
			var username = user.username;
			var count = 0;
			var newAuthor = [];
			_.each(authorofposts, function(findId){
				if(findId === id) {
					count++;
				} else {
					newAuthor.push(findId);
				}
			});
			if(count>0) {
				User.update({'username' : username}, {'authorofposts': newAuthor}, function updatedUser(err, user){
					if(err) {
						var reply = {
							'status' : 221,
							'message' : 'An error occured while deleting the post'
						};
						res.status(200).json(reply);
					} else {
						var reply = {
							'status' : 222,
							'message' : 'The post has been deleted successfully',
							'post' : response,
							'user' : user
						};
						res.status(200).json(reply);
					}
				});
			} else {
				var reply = {
					'status' : 220,
					'message' : 'The user could not be updated',
					'post' : response
				};
				res.status(200).json(reply);
			}
		}
	}
	
};

