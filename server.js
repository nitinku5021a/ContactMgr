var express = require('express');
var app = express();
var mongojs = require('mongojs');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');

/* for local db connection ***/
//var db = mongojs('localhost/test', ['contactList', 'users']);

var db = mongojs(process.env.PROD_MONGODB, ['contactList','users']);

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use('local', new LocalStrategy(
    function (username, password, done) {
        db.users.findOne({
            'username': username
        }, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false);
            }
            if (user.password != password) {
                return done(null, false);
            }
            return done(null, user);
        });
    }));

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(session({
    secret: "mySecretString",
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/login', function (req, res) {
    console.log('Inside get login');
    res.redirect('login.html');
});

app.get('/register', function (req, res) {
    res.redirect('register.html');
});

app.post('/login',
    passport.authenticate('local', {
        failureRedirect: '/login'
    }),
    function (req, res) {
        res.redirect('/');
    });

app.post('/register', function (req, res) {
    console.log('Inside register: ', req.body);
    db.users.insert(req.body, function (err, doc) {
        if (err) {
            res.send(err);
        } else {
            res.redirect('/login');
        }
    })
});

function isLoggedIn(req, res, next) {
    console.log('Inside isLoggedIn');
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}

app.get('/', isLoggedIn, function(req, res){
    console.log('Inside get root');
   res.redirect('contacts.html') 
});

app.get('/contactList', function (req, res) {
    db.contactList.find(function (err, docs) {
        res.json(docs);
    });

});

app.post('/contactList', function (req, res) {
    console.log(req.body);
    db.contactList.insert(req.body, function (err, docs) {
        res.json(docs);
    });
});

app.delete('/contactList/:id', function (req, res) {
    var id = req.params.id;
    db.contactList.remove({
        _id: mongojs.ObjectId(id)
    }, function (err, docs) {
        res.json(docs);
    });

});

app.get('/contactList/:id', function (req, res) {
    var id = req.params.id;
    db.contactList.findOne({
        _id: mongojs.ObjectId(id)
    }, function (err, docs) {
        res.json(docs);
    });
});

app.put('/contactList/:id', function (req, res) {
    var id = req.params.id;
    db.contactList.findAndModify({
        query: {
            _id: mongojs.ObjectId(id)
        },
        update: {
            $set: {
                Name: req.body.Name,
                Mobile: req.body.Mobile,
                Email: req.body.Email
            }
        },
        new: true
    }, function (err, docs) {
        res.json(docs);
    });
});

var port = process.env.PORT || 8080;
app.listen(port);

console.log("Server is running");