var router = require('express').Router();
var db = require('../database');
var googleMaps = require('./foreign-apis/google-maps');
var { getTrailsByLoc } = require('./foreign-apis/trails.js');

router.get('/currentUser', (req, res) => {
  res.send(req.user || null);
});

router.get('/posts', (req, res) => {
  db.getAllPosts()
  .then(posts => {
    res.send(posts);
  });
});

router.post('/posts', (req, res) => {
  var post = req.body.photo;
  db.createPost(req.user.email, post.trail_id, post.title, post.text, post.image_url, post.latitude, post.longitude)
  .then((post) => {
    res.end(JSON.stringify(post));
  })
  .catch((error) => {
    res.status(500).json(error);
  });
});

//for testing purpose, remove after socket integration
router.post('/posts/like', (req, res) => {
  // var postId = req.params.postId;
  var {postId} = req.body;
  if (req.user) {
    db.likePost(req.user.id, postId)
    .then(result => {
      res.send(result);
    });
  } else {
    res.send('not logged in');
  }
});
//remove after

//for testing purpose, remove after socket integration
router.post('/posts/unlike', (req, res) => {
  // var postId = req.params.postId;
  var {postId} = req.body;
  if (req.user) {
    db.unlikePost(req.user.id, postId)
    .then(result => {
      res.send(result);
    });
  } else {
    res.send('not logged in');
  }
});
//remove after

router.get('/posts/users/:useremail', (req, res) => {
  var userEmail = req.params.useremail;
  db.getPostsByUserEmail(userEmail).then((posts) => {
    res.end(JSON.stringify(posts));
  });
});

router.get('/posts/trails/:trailId', (req, res) => {
  let trailId = req.params.trailId;
  db.getPostsByTrailId(trailId).then((posts) => {
    res.end(JSON.stringify(posts));
  });
});

router.get('/trails/:trailId', (req, res) => {
  let trailId = req.params.trailId;
  db.getTrailById(trailId)
  .then(trail => {
    res.send(trail);
  });
});

router.get('/trails', (req, res) => {
  let lat = `${req.query.lat || 34}`;
  let long = `${req.query.lng || -104}`;
  let radius = `${req.query.radius || 100}`;
  let limit = `${req.query.radius || 25}`;
  getTrailsByLoc(lat, long, radius, limit, (err, data) => {
    if(err) {
      res.end(JSON.stringify(err));
    } else {
      data.places.forEach(trail => {
        db.createTrail(trail.unique_id, trail.name, trail.directions, trail.lat, trail.lon);
      });
      res.end(JSON.stringify(data));
    }
  })
});

router.get('/*', (req, res) => {
  res.end('Invalid API request');
});

module.exports = router;
