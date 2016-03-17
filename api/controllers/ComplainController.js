/**
 * ComplainController
 *
 * @description :: Server-side logic for managing complains
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	'complain' : function(req, res) {
		var email = req.param('email');
		var query = req.param('query');
		var name = req.param('name');
		if(email && query && name) {
			Complain.create({
				'name' : name,
				'email' : email,
				'query' : query
				}, function complainCreated(err, newComplain){
					if(err) {
						var reply = {
							'status' : 124,
							'message' : 'An error occured while reigstering the complain'
						};
						res.status(200).json(reply);
					} else {
						var reply = {
							'status' : 125,
							'message' : 'Successfully registered the complain',
							'complain' : newComplain
						};
						res.status(200).json(reply);
					}
				});
		} else {
			var reply = {
				'status' : 126,
				'message' : 'Wrong params while registering the complain'
			};
			res.status(200).json(reply);
		}
	},
};

