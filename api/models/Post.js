/**
* Post.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

  		title : {
  			type : 'string'
  		},
  		shortdesc : {
  			type : 'string'
  		},
  		longdesc : {
  			type : 'string'
  		},
  		no_of_steps : {
  			type : 'int'
  		},
  		steps : {
  			type : 'array'
  		},
      platform : {
        type : 'string'
      },
  		images : {
  			type : 'string'
  		},
  		author : {
  			type : 'string'
  		},
  		stars : {
  			type : 'int'
  		},
  		downstars : {
  			type : 'int'
  		},
  		no_of_issues : {
  			type : 'int'
  		},
  		website_link : {
  			type : 'string'
  		},
  		youtube_link : {
  			type : 'string'
  		},
  		author_website : {
  			type : 'string'
  		},
  		github_link : {
  			type : 'string'
  		},
  		linkedin_link : {
  			type : 'string'
  		},
  		username : {
  			type : 'string'
  		},
  		category : {
  			type : 'string'
  		},
  		tags : {
  			type : 'array'
  		},
  		download_link : {
  			type : 'string'
  		},
  		publishstatus : { // to see whetherthe post is published or in users drafts
  			type : 'int'
  		}

  }
};

