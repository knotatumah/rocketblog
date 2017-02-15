/*
=============================================
    Configuration
=============================================
*/
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const port = process.env.PORT || 8080;

// configure app to use bodyParser() for POST data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Allow cross-domain for client interaction
app.use(cors());

//Connecting to database using Mongoose
const mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost/rocketBlog');
const Post = require('./posts_model.js');

mongoose.Promise = Promise; //Using ES6 promises

/*
=============================================
    Defining Routes
=============================================
*/
const router = express.Router();

//Log incomming requests
router.use(function(req, res, next) {
    const date = new Date();
    const time = date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

    console.log(time + ' ' + req.method + ' request to ' + req.path);
    next();
});

router.route('/query').post(function(req,res)
{
    Post.find(req.body.find,req.body.show)
    .sort({'date':req.body.sort})
    .limit(req.body.limit)
    .catch(function(err)
    {
        res.send(err);
        return;
    })
    .then(function(data)
    {
        res.json({'posts':data, 'status':'success'});
    });
});

router.route('/querySingle').post(function(req,res)
{
    /*
    3-step query: get the desired entry,
    check if its the latest post,
    then check if its the 1st post
    */

    Post.find(req.body.find, req.body.show)
    .sort({'date':req.body.sort})
    .limit(req.body.limit)
    .catch(function(err)
    {
        res.send(err);
        return;
    })
    .then(function(data)
    {
        if (!data.length)
        {
            res.json({'status':'no data'})
        }

        let results =
        {
            'posts':data,
            'status':'success',
        };

        //Compare against the latest post
        Post.find({},{'__v':0})
        .sort({'date':-1})
        .limit(1)
        .catch(function(err)
        {
            res.send(err);
            return;
        })
        .then(function(newestPost)
        {
            if (data[0]._doc.date === newestPost[0]._doc.date)
            {
                //Result is the newest (latest)
                results.isOldest = false;
                results.isNewest = true;

                res.json(results);
                return;
            }

            //Compare against the oldest post
            Post.find({},{'__v':0})
            .sort({'date':1})
            .limit(1)
            .catch(function(err)
            {
                res.send(err);
                return;
            })
            .then(function(oldestPost)
            {
                if (data[0]._doc.date === oldestPost[0]._doc.date)
                {
                    //Result is first (oldest)
                    results.isOldest = true;
                    results.isNewest = false;
                }
                else
                {
                    //Result is neither first or last
                    results.isOldest = false;
                    results.isNewest = false;
                }

                res.json(results);
            });
        });
    });
});

//Fetch last record based on date
router.route('/latest').get(function(req, res)
{
    Post.find({},{'__v':0})
    .sort({'date':-1})
    .limit(1)
    .catch(function(err)
    {
        res.send(err);
        return;
    })
    .then(function(data)
    {

        let results =
        {
            'posts':data,
            'status':'success',
            'isOldest':false,
            'isNewest':true,
        }

        res.json(results);
    });
});
 
//Fetch next record based on date 
router.route('/next/:date').get(function(req, res)
{
    Post.find({'date':{$gt:req.params.date}},{'__v':0})
    .sort({'date':1})
    .limit(1)
    .catch(function(err)
    {
        res.send(err);
    })
    .then(function(data)
    {
        if (!data.length)
        {
            res.json({'status':'no data'});
        }

        let results =
        {
            'posts':data,
            'status':'success',
        }

        //Compare to last availble post
        Post.find({},{'__v':0})
        .sort({'date':-1})
        .limit(1)
        .catch(function(err)
        {
            res.send(err);
        })
        .then(function(subject)
        {
            if (subject[0]._doc.date == data[0]._doc.date)
            {
                results.isOldest = false;
                results.isNewest = true;
            }
            else
            {
                results.isOldest = false;
                results.isNewest = false;
            }

            res.json(results);

        });
    });
});

//Fetch previous record based on date
router.route('/previous/:date').get(function(req, res)
{

    Post.find({'date':{$lt:req.params.date}},{'__v':0})
    .sort({'date':-1})
    .limit(1)
    .catch(function(err)
    {
        res.send(err);
    })
    .then(function(data)
    {

        if (!data.length)
        {
            res.json({'status':'no data'});
        }

        let results =
        {
            'posts':data,
            'status':'success',
        }

        Post.find({},{'__v':0})
        .sort({'date':1})
        .limit(1)
        .catch(function(err)
        {
            res.send(err);
        })
        .then(function(subject)
        {
            if (subject[0]._doc.date == data[0]._doc.date)
            {
                results.isOldest = true;
                results.isNewest = false;
            }
            else
            {
                results.isOldest = false;
                results.isNewest = false;
            }

            res.json(results);
        });
    });
});

//Fetch first record based on date
router.route('/first').get(function(req, res)
{
    Post.find({},{'__v':0})
    .sort({'date':1})
    .limit(1)
    .catch(function(err)
    {
        res.send(err);
    })
    .then(function(data)
    {
        let results =
        {
            'posts':data,
            'status':'success',
            'isOldest':true,
            'isNewest':false,
        }

        res.json(results);
    });
});

/*
=============================================
    Starting Server
=============================================
*/

//Root url
app.use('/api', router);

app.listen(port);
console.log('Now listening on ' + port);