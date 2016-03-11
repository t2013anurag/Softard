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
								'message': 'User loggedin but incomplete profile',
								'user' : user,
								'userid': user.id,
								'username': user.name,
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
			console.log(name + username + email + encryptedPassword);
			User.create({
				'name' : name,
				'username' : username,
				'email' : email,
				'encryptedPassword' : encryptedPassword
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
						'username': user.username
					};
					res.status(200).json(reply);
					return;
				}
			});
		}
	},

	'update' : function(req, res) {
		var username = req.param('username');
		var email = req.param('email');
		var name = req.param('name');
		var password = req.param('password');
		var encryptedPassword = "Anurag";
		require('bcryptjs').hash(password, 10, function passwordEncrypted(err, encryptedPassword){
			if(err) {
				var reply = {
					'status' : 112,
					'message' : 'Could not hash the password'
				};
				res.status(200).json(reply);
				return next(err);
			} else { 
				encryptedPassword = encryptedPassword;
				User.findOneByUsername(username, function foundUser(err, user){
				if(err) {
					var reply = {
						'status' : 113,
						'message': 'An error occured while finding the user'
					};
					res.status(200).json(reply);
				} 
				if(!user) {
					var reply = {
						'status' : 114,
						'message' : 'The details Could not be updated'
					};
					res.status(200).json(reply);
				} else {
					update_user_details();
				}
			});
		}
		});

		function update_user_details() {
			User.update({
				'username' : username
			}, {
				'name' : name,
				'encryptedPassword' : encryptedPassword,
			}, function userUpdated(err, user){
				if(err) {
					var reply = {
						'status' : 115,
						'message' : 'An error occured while updating the user account details'
					};
					res.status(200).json(reply);
				} else {
					var reply = {
						'status': 116,
						'message': 'Successfully updated the user details',
						'user' : user,
						'userid': user.id,
						'username': user.name,
						'email': user.email,
						'mobile': user.mobile
					};
					res.status(200).json(reply);
				}
			});
		}
	}
};
