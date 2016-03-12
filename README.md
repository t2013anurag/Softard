# softard

a [Sails](http://sailsjs.org) application



Softard : An innovative way to communicate with your software and hardware.

url to create post :
http://localhost:1337/post/createpost?title=second&shortdesc=small&longdesc=long&steps={"1":"kuchkaro","2":"aisa"}&tags=nodejs&tags=dfsfs

to view all posts :
http://localhost:1337/post/viewall

to view post by id :
http://localhost:1337/post/viewpostbyid?id=56e3fca455f0327724e64504

to view post by username(of any specific author) : 
http://localhost:1337/post/viewpostbyauthor?username=softard

orm.collections.user.find({
        $and: [
            { name: { contains: 'neil' } },
            { name: { contains: 'armstrong' } }
        ]
    });

   
    User.count().where({
    id: { '!=': req.params.id },
    lastname: req.body.lastname
}).exec(function(err, num){
    console.log(num);
});