/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

  		name: {
  			type: 'string'
  		},
  		email: {
  			type: 'string',
  			required: 'true'
  		},
  		encryptedPassword: {
  			type: 'string'
  		},
  		username: {
  			type: 'string',
  			unique: true
  		},
  		verified : {
  			type: 'int'
  		},
  		mobile : {
  			type : 'int'
  		},
  		admin : {
  			type: 'boolean',
			defaultsTo: false
  		},
  		authorofposts : {
  			type : 'array'
  		},
  		totalnoofposts : {
  			type : 'int'
  		},
  		totalnoofviews : {
  			type : 'int'
  		},
  		totalnoofstars : {
  			type : 'int'
  		},
  		totalnoofdownstars : {
  			type : 'int'
  		},
  		avatar : {
  			type : 'string'
  		},
  		avatarUrl : {
  			type : 'string'
  		},
  		profession : {
  			type : 'string'
  		},
  		website : {
  			type : 'string'
  		},
  		about : {
  			type : 'string'
  		}

  // 		toJSON: function(){
		// var object = this.toObject();
		// delete object.confirmation;
		// delete object._csrf;
		// delete object.encryptedPassword;
		// return object;
		// }

  }
};

