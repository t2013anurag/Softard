/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var bcrypt = require('bcryptjs');
module.exports = {

	'login' : function(req, res) {	
			if(req.param('username') && req.param('password')) {
				var username = req.param('username');
				var password = req.param('password');
				User.findOneByUsername(username, function foundUser(err, user){
					if(err) {
						var reply = {
							'status' : 101,
							'message': 'An error occured while finding the required account'
						};
						res.status(200).json(reply);
					} 
					if(!user) {
						var reply = {
							'status' : 102,
							'message': 'An account with this username does not exist'
						};
						res.status(200).json(reply);
					} else {
						require('bcryptjs').hash(password, 10, function passwordEncrypted(err, encrypted){
							if(err) {
								var reply = {
									'status' : 1000,
									'message' : 'dasdasda'
								};
								res.status(200).json(reply);
								return next(err);
							} else { 
							 	login_user(user);
							}
						});
					}
				});
			} else {
				var reply = {
					'status' : 100,
					'message': 'All the parameters were not sent!'
				};
				res.status(200).json(reply);
			}

			function login_user(user) {
				bcrypt.compare(password, user.encryptedPassword, function(err, valid){
				if(err) {
					var reply = {
						'status': 103,
						'message': 'An error occured while comparing passwords'
					};
					res.status(200).json(reply);
				}
				if(!valid) {
					var reply = {
						'status' : 104,
						'message': 'The password is invalid'
					};
					res.status(200).json(reply);
				} else {
					req.session.authenticated = true;
					req.session.User = user;
					if(!user.admin) {
						if(!user.mobile || !user.verfied) {
							var reply = {
								'status': 105,
								'message': 'User logged in but incomplete profile',
								'user' : user,
								'userid': user.id,
								'username': user.username,
								'email': user.email,
								'mobile': user.mobile
							};
							res.status(200).json(reply);
						} else {
							var reply = {
								'status': 106,
								'message': 'User loggedin with complete profile',
								'user' : user,
								'userid': user.id,
								'username': user.name,
								'email': user.email,
								'mobile': user.mobile
							};
							res.status(200).json(reply);
						}
					} else {
							var reply = {
								'status': 107,
								'message': 'Admin access granted'
						};
						res.status(200).json(reply);
					}
				}
			});								
		}
	},


	'signup' : function(req, res) {
		var username = req.param('username');
		var email = req.param('email');
		var name = req.param('name');
		var password = req.param('password');
		var encryptedPassword = "Anurag";
		var authorofposts = [];
		require('bcryptjs').hash(password, 10, function passwordEncrypted(err, encryptedPassword){
			if(err) {
				var reply = {
					'status' : 1000,
					'message' : 'Could not hash the password'
				};
				res.status(200).json(reply);
				return next(err);
			} else { 
				encryptedPassword = encryptedPassword;
				User.find().where({'username' : username}).exec(function foundUser(err, users){
				if(err) {
					var reply = {
						'status' : 108,
						'message': 'An error occured while finding the user'
					};
					res.status(200).json(reply);
				} else if(users.length === 0) {
					create_user_account(encryptedPassword);
				} else {
					var reply = {
						'status' : 109,
						'message' : 'The user already exists'
					};
					res.status(200).json(reply);
				}
			});
		}
		});

		function create_user_account(encryptedPassword) {
			var avatar = null;
			var avatarUrl = null;
			var profession = null, website = null, mobile = null, verfied = null,about = null;
			User.create({
				'name' : name,
				'username' : username,
				'email' : email,
				'encryptedPassword' : encryptedPassword,
				'authorofposts' : authorofposts,
				'avatar' : avatar,
				'avatarUrl' : avatarUrl,
				'profession' : profession,
				'website' : website,
				'mobile' : mobile,
				'verfied' : verfied,
				'about' : about
			}, function userCreated(err, user){
				if(err) {
					var reply = {
						'status' : 110,
						'message' : 'An error occued while creating the user account'
					};
					res.status(200).json(reply);
					return;
				} else {
					req.session.authenticated = true;
					req.session.User = user;
					var token = req.session.id;
					var reply = {
						'status' : 111,
						'message': 'Successfully created the user account',
						'name' : user.name,
						'email' : user.email,
						'token' : token,
						'username': user.username,
						'authorofposts' : user.authorofposts,
						'avatar' : avatar,
						'user' : user
					};
					res.status(200).json(reply);
					return;
				}
			});
		}
	},

	'update' : function(req, res) {
		var username = req.param('username');
		var password = req.param('password');
		var newpassword = req.param('newpassword');
		var encryptedPassword = "Anurag";

		User.findOneByUsername(username, function(err, user){
			if(err) {
				var reply = {
					'status' : 1100,
					'message' : 'An error oxxured while finding the user'
				};
				res.status(200).json(reply);
			}
			if(!user) {
				var reply = {
					'status' : 1101,
					'message' : 'The user could not be found'
				};
				res.status(200).json(reply);
			} else {
				var userCurrentPassword = user.encryptedPassword;
				checkUserValidity(password, userCurrentPassword);
			}
		});


		function checkUserValidity(password, userCurrentPassword) {
			bcrypt.compare(password, userCurrentPassword, function(err, valid){
				if(err) {
					var reply = {
						'status': 1103,
						'message': 'An error occured while comparing passwords'
					};
					res.status(200).json(reply);
				}
				if(!valid) {
					var reply = {
						'status' : 1104,
						'message': 'The password is invalid'
					};
					res.status(200).json(reply);
				} else {
					updateUserPassword(newpassword);
				}
			});	
		}

		function updateUserPassword(newpassword) {
			require('bcryptjs').hash(newpassword, 10, function passwordEncrypted(err, newEncrypted){
				if(err) {
					var reply = {
						'status' : 1105,
						'message' : 'The password could not be hashed'
					};
					res.status(200).json(reply);
					return next(err);
				} else { 
					User.update({
						'username' : username
					}, {
						'encryptedPassword' : newEncrypted,
					}, function userUpdated(err, user){
						if(err) {
							var reply = {
								'status' : 1106,
								'message' : 'An error occured while updating the user account details'
							};
							res.status(200).json(reply);
						} else {
							var reply = {
								'status': 1107,
								'message': 'Successfully updated the user details',
								'user' : user,
								'userid': user.id,
								'username': user.username,
								'email': user.email,
								'mobile': user.mobile
							};
							res.status(200).json(reply);
						}
					});	
				}
			});

		}
	},

	'deleteuser' : function(req, res) {
		var username = req.param('username');
		User.destroy({username:username}).exec(function (err){
			if(err) {
				var reply = {
					'status' : 117,
					'message' : 'An error occured while deleting the user'
				};
				res.status(200).json(reply);
			} else {
				var reply = {
					'status' : 118,
					'message' : 'User Successfully deleted'
				};
				res.status(200).json(reply);
			}
		});
	},


	'uploadphoto' : function(req, res) {
		 if(req.session.authenticated){
			var username = req.session.User.username;
			var file = req.param('avatar');
			var avatarimg = '/assets/images/'+username;
			var avatarUrl =  require('util').format('%s/user/%s', sails.getBaseUrl(),req.session.User.username);
			res.setTimeout(0);
		    req.file('avatar')
		    .upload({
		      dirname : '../.../../../assets/images/'+username,
		      saveAs : 'avatar',
		      // You can apply a file upload limit (in bytes)
		      maxBytes: 1000000
		    }, function whenDone(err, uploadedFiles) {
		      if (err) {
		      	var reply = {
		      		'status' : 120,
		      		'message' : 'error'
		      	};
		      	res.status(200).json(reply);
		      }
		    else {
		    	User.update({
					'username' : username
					}, {'avatar' : avatarimg, 'avatarUrl' : avatarUrl}, function userUpdated(err, updatedUser){
						if(err) {
							var reply = {
								'status' : 121,
								'message' : 'An error occured while uploading the photo'
							};
							res.status(200).json(reply);
						} else {
							var reply = {
								'status' : 122,
								'message' : 'Done',
								'files' : uploadedFiles
							};
							res.status(200).json(reply);
						}
					});
		    	}
		    });
		} else {
			var reply = {
				'status' : 123,
				'message' : 'oops login'
			};
			res.status(200).json(reply);
		}
	},

	'updateprofile' : function(req, res) {
			var email = req.param('email');
			var name = req.param('name');
			var website = req.param('website');
			var mobile = req.param('mobile');
			var about = req.param('about');
			var username = req.param('username');
			var profession = req.param('profession');
			about = about.replace(/-/g,' ');
			profession = profession.replace(/-/g,' ');
			name = name.replace(/-/g,' ');
					User.findOneByUsername(username, function foundUser(err, user){
					if(err) {
						var reply = {
							'status' : 124,
							'message': 'An error occured while finding the user'
						};
						res.status(200).json(reply);
					} 
					if(!user) {
						var reply = {
							'status' : 125,
							'message' : 'The details Could not be updated'
						};
						res.status(200).json(reply);
					} else {
						update_user_details();
					}
				});
		
		function update_user_details() {
			User.update({
				'username' : username
			}, {
				'name' : name,
				'email' : email,
				'mobile' : mobile,
				'website' : website,
				'about' : about,
				'profession' : profession
			}, function userUpdated(err, user){
				if(err) {
					var reply = {
						'status' : 127,
						'message' : 'An error occured while updating the user account details'
					};
					res.status(200).json(reply);
				} else {
					var reply = {
						'status': 130,
						'message': 'Successfully updated the user details',
						'user' : user,
						'userid': user.id,
						'username': user.username,
						'email': user.email,
						'mobile': user.mobile
					};
					res.status(200).json(reply);
				}
			});
		}
	},

}			
		
