const expect = require('chai').use(require('chai-as-promised')).expect;
let models = require('../database/models.js');
let sequelize = models.sequelize;
let dbFuncs = require('../database/index.js');
let db = require('./mockdb.json');

module.exports.run = () => {
  describe('Models', () => {
    describe('Users', () => {
      it('Should exist', () => {
        expect(models.users).to.exist;
      });
    });
    describe('Trails', () => {
      it('Should exist', () => {
        expect(models.trails).to.exist;
      });
    });
    describe('Posts', () => {
      it('Should exist', () => {
        expect(models.posts).to.exist;
      });
    });
  });

  describe('Export Functions', () => {
    // Forcefully sync database before testing
    before(() => {
      return sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
      .then(() => {
        return sequelize.sync({force: true});
      })
      .then(() => {
        return sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
      })
      .then(() => {
        return sequelize.sync();
      })
      .then(() => {
        let promises = [];
        for (let i = 0; i < db.users.length; i++) {
          promises.push(
            models.users.create(db.users[i])
          );
        }
        for (let i = 0; i < db.trails.length; i++) {
          promises.push(
            models.trails.create(db.trails[i])
          );
        }
        return Promise.all(promises);
      });
    });

    // Wipe database when done testing
    after(() => {
      return sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
      .then(() => {
        return sequelize.sync({force: true});
      })
      .then(() => {
        return sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
      })
      .then(() => {
        return sequelize.sync();
      });
    });

    describe('getUserByEmail()', () => {
      it('Should exist', () => {
        expect(dbFuncs.getUserByEmail).to.exist;
      });
      it('Should be a function', () => {
        expect(dbFuncs.getUserByEmail).to.be.a('function');
      });
      it('Should retrieve a user if they are registered to the given email', () => {
        return dbFuncs.getUserByEmail(db.users[0].email)
        .then((user) => {
          expect(user).to.exist;
          expect(user.email).to.equal(db.users[0].email);
        });
      });
      it('Should reject if no user exists with the current email', () => {
        return expect(dbFuncs.getUserByEmail('thisisa@fake.email')).to.be.rejected;
      });
    });

    describe('getTrailsByName()', () => {
      it('Should exist', () => {
        expect(dbFuncs.getTrailsByName).to.exist;
      });
      it('Should be a function', () => {
        expect(dbFuncs.getTrailsByName).to.be.a('function');
      });
      it('Should retrieve a trail if it exists in the database', () => {
        return dbFuncs.getTrailsByName(db.trails[0].name)
        .then((trails) => {
          expect(trails).to.exist;
          expect(trails.length).to.equal(1);
          expect(trails[0].createdAt).to.exist;
          expect(trails[0].updatedAt).to.exist;
          expect(trails[0].id).to.equal(db.trails[0].id);
          expect(trails[0].name).to.equal(db.trails[0].name);
          expect(trails[0].latitude).to.equal(db.trails[0].latitude);
          expect(trails[0].longitude).to.equal(db.trails[0].longitude);
        });
      });
      it('Should retrieve an empty array if querying a trail name that corresponds to no trails', () => {
        return expect(dbFuncs.getTrailsByName('notarealtrail')).to.eventually.deep.equal([]);
      });
      it('Should reject if passed in undefined', () => {
        return expect(dbFuncs.getTrailsByName(undefined)).to.be.rejected;
      });
      it('Should reject if passed in null', () => {
        return expect(dbFuncs.getTrailsByName(null)).to.be.rejected;
      });
    });

    describe('getAllTrails()', () => {
      it('Should exist', () => {
        expect(dbFuncs.getAllTrails).to.exist;
      });
      it('Should be a function', () => {
        expect(dbFuncs.getAllTrails).to.be.a('function');
      });
      it('Should retrieve all trails', () => {
        return dbFuncs.getAllTrails()
        .then((trails) => {
          expect(trails.length).to.equal(db.trails.length);
          for (let i = 0; i < trails.length; i++) {
            expect(trails[i].createdAt).to.exist;
            expect(trails[i].updatedAt).to.exist;
            expect(trails[i].id).to.equal(db.trails[i].id);
            expect(trails[i].name).to.equal(db.trails[i].name);
            expect(trails[i].latitude).to.equal(db.trails[i].latitude);
            expect(trails[i].longitude).to.equal(db.trails[i].longitude);
          }
        });
      });
    });

    describe('createTrail()', () => {
      it('Should exist', () => {
        expect(dbFuncs.createTrail).to.exist;
      });
      it('Should be a function', () => {
        expect(dbFuncs.createTrail).to.be.a('function');
      });
      it('Should create a trail when using all valid parameters', () => {
        let apiId = 12345678
        let name = 'new trail';
        let directions = 'just look it up on google maps';
        let latitude = 4;
        let longitude = 8;
        return dbFuncs.createTrail(apiId, name, directions, latitude, longitude)
        .then((trail) => {
          expect(trail).to.exist;
          expect(trail.id).to.exist;
          expect(trail.createdAt).to.exist;
          expect(trail.updatedAt).to.exist;
          expect(trail.id).to.equal(apiId);
          expect(trail.name).to.equal(name);
          expect(trail.directions).to.equal(directions);
          expect(trail.latitude).to.equal(latitude);
          expect(trail.longitude).to.equal(longitude);
        });
      });
      it('Should return the existing trail when attempting to create a new trail with the same ID as an existing one', () => {
        let apiId = 12345678
        let name = 'different trail';
        let directions = 'just look it up on google maps';
        let latitude = 4;
        let longitude = 8;
        return dbFuncs.createTrail(apiId, name, directions, latitude, longitude)
        .then((trail) => {
          expect(trail).to.exist;
          expect(trail.id).to.exist;
          expect(trail.createdAt).to.exist;
          expect(trail.updatedAt).to.exist;
          expect(trail.id).to.equal(apiId);
          expect(trail.name).to.equal('new trail');
          expect(trail.directions).to.equal(directions);
          expect(trail.latitude).to.equal(latitude);
          expect(trail.longitude).to.equal(longitude);
        });
      });
      it('Should reject when name is not a string', () => {
        return expect(dbFuncs.createTrail(null, 'directions', 1, 1)).to.be.rejected;
      });
      it('Should reject when directions is not a string', () => {
        return expect(dbFuncs.createTrail('name', null, 1, 1)).to.be.rejected;
      });
    });

    describe('createPost()', () => {
      it('Should exist', () => {
        expect(dbFuncs.createPost).to.exist;
      });
      it('Should be a function', () => {
        expect(dbFuncs.createPost).to.be.a('function');
      });
      it('Should create a post with all valid parameters', () => {
        let title = 'Example post title';
        let text = 'Example post text';
        let imageUrl = 'http://exampleurl.com/';
        return dbFuncs.createPost(db.users[0].email, db.trails[0].id, title, text, imageUrl, 0, 0)
        .then((post) => {
          expect(post).to.exist;
          expect(post.createdAt).to.exist;
          expect(post.updatedAt).to.exist;
          expect(post.title).to.equal(title);
          expect(post.text).to.equal(text);
          expect(post.image_url).to.equal(imageUrl);
        });
      });
      it('Should reject when title is not a string', () => {
        return expect(dbFuncs.createPost(db.users[1].email, db.trails[0].id, null, 'text', 'url', 0, 0)).to.be.rejected;
      });
      it('Should reject when text is not a string', () => {
        return expect(dbFuncs.createPost(db.users[1].email, db.trails[0].id, 'title', null, 'url', 0, 0)).to.be.rejected;
      });
      it('Should reject when image url is not a string', () => {
        return expect(dbFuncs.createPost(db.users[1].email, db.trails[0].id, 'title', 'text', null, 0, 0)).to.be.rejected;
      });
    });

    describe('getAllPosts()', () => {
      it('should return all posts in Posts table with poster property', () => {
        return dbFuncs.getAllPosts()
        .then(posts => {
          expect(posts).to.exist;
          posts.forEach(post => {
            expect(post.poster).to.exist;
          });
        });
      });
    });


    describe('getPostsByUserEmail()', () => {
      it('Should exist', () => {
        expect(dbFuncs.getPostsByUserEmail).to.exist;
      });
      it('Should be a function', () => {
        expect(dbFuncs.getPostsByUserEmail).to.be.a('function');
      });
      it('Should get posts by a particular user', () => {
        let title = 'Example post title';
        let text = 'Example post text';
        let imageUrl = 'http://exampleurl.com/';
        return dbFuncs.getPostsByUserEmail(db.users[0].email)
        .then((posts) => {
          expect(posts).to.exist;
          expect(posts.length).to.equal(1);
          expect(posts[0].createdAt).to.exist;
          expect(posts[0].updatedAt).to.exist;
          expect(posts[0].title).to.equal(title);
          expect(posts[0].text).to.equal(text);
          expect(posts[0].image_url).to.equal(imageUrl);
          expect(posts[0].view_count).to.exist;
          expect(posts[0].flag_count).to.exist;
          expect(posts[0].latitude).to.equal(0);
          expect(posts[0].longitude).to.equal(0);
          expect(posts[0].poster).to.exist;
          expect(posts[0].poster.email).to.equal(db.users[0].email);
        });
      });
    });

    describe('getPostsByTrailName()', () => {
      it('Should exist', () => {
        expect(dbFuncs.getPostsByTrailId).to.exist;
      });
      it('Should be a function', () => {
        expect(dbFuncs.getPostsByTrailId).to.be.a('function');
      });
      it('Should get posts for a particular trail', () => {
        let title = 'Example post title';
        let text = 'Example post text';
        let imageUrl = 'http://exampleurl.com/';
        return dbFuncs.getPostsByTrailId(db.trails[0].id)
        .then((posts) => {
          expect(posts).to.exist;
          expect(posts.length).to.equal(1);
          expect(posts[0].createdAt).to.exist;
          expect(posts[0].updatedAt).to.exist;
          expect(posts[0].title).to.equal(title);
          expect(posts[0].text).to.equal(text);
          expect(posts[0].image_url).to.equal(imageUrl);
          expect(posts[0].view_count).to.exist;
          expect(posts[0].flag_count).to.exist;
          expect(posts[0].latitude).to.equal(0);
          expect(posts[0].longitude).to.equal(0);
          expect(posts[0].poster).to.exist;
          expect(posts[0].poster.email).to.equal(db.users[0].email);
        });
      });
    });

    describe('likePost()', () => {
      it('should exist', () => {
        expect(dbFuncs.likePost).to.exist;
      });
      it('should be a function', () => {
        expect(dbFuncs.likePost).to.be.a('function');
      });
      it('should insert new record into Like table if post has not been liked', () => {
        return dbFuncs.likePost(db.users[0].id, 1)
        .then(post => {
          expect(post).to.exist;
          expect(post.userId).to.equal(db.users[0].id);
          expect(post.postId).to.equal(1);
          expect(post.like).to.equal(true);
        });
      });
      it('should not change like column if post is liked again', () => {
        return dbFuncs.likePost(db.users[0].id, 1)
        .then(post => {
          return models.likes.findOne({where: {id: 1}});
        })
        .then(post => {
          expect(post.like).to.equal(true);
        });
      });
    });

    describe('unlikePost()', () => {
      it('should exist', () => {
        expect(dbFuncs.unlikePost).to.exist;
      });
      it('should be a function', () => {
        expect(dbFuncs.unlikePost).to.be.a('function');
      });
      it('should change like column to false when triggered', () => {
        return dbFuncs.unlikePost(db.users[0].id, 1)
        .then(post => {
          return models.likes.findOne({where: {id :1}});
        })
        .then(post => {
          expect(post.like).to.equal(false);
        });
      });
      it('should not change like column if post is unliked again', () => {
        return dbFuncs.unlikePost(db.users[0].id, 1)
        .then(post => {
          return models.likes.findOne({where: {id :1}});
        })
        .then(post => {
          expect(post.like).to.equal(false);
        });
      });
    });

    describe('createLabels()', () => {
      it('should exist', () => {
        expect(dbFuncs.createLabels).to.exist;
      });
      it('should be a function', () => {
        expect(dbFuncs.createLabels).to.be.a('function');
      });
      it('should insert labels into Labels table', () => {
        var label1 = {
          label: 'forest',
          score: 0.94,
          post_id: 1,
          trail_id: db.trails[0].id
        };
        var label2 = {
          label: 'coast',
          score: 0.78,
          post_id: 1,
          trail_id: db.trails[0].id
        };
        var labels = [label1, label2];
        return dbFuncs.createLabels(labels)
        .then(labels => {
          expect(labels.length).to.equal(labels.length);
          expect(labels[0].label).to.equal(label1.label);
          expect(labels[0].post_id).to.equal(label1.post_id);
          expect(labels[1].score).to.equal(label2.score);
          expect(labels[1].trail_id).to.equal(label2.trail_id);
        });
      });
    });

    describe('findLabelsByPostId()', () => {
      it('should exist', () => {
        expect(dbFuncs.findLabelsByPostId).to.exist;
      });
      it('should be a function', () => {
        expect(dbFuncs.findLabelsByPostId).to.be.a('function');
      });
      it('should return labels with specified post id', () => {
        return dbFuncs.findLabelsByPostId(1)
        .then(labels => {
          labels.forEach(label => {
            expect(label.post_id).to.equal(1);
          });
        });
      });
    });

    describe('getAllLabels()', () => {
      it('should exist', () => {
        expect(dbFuncs.getAllLabels).to.exist;
      });
      it('should be a function', () => {
        expect(dbFuncs.getAllLabels).to.be.a('function');
      });
      it('should return all records with label attribute from Labels table', () => {
        return dbFuncs.getAllLabels()
        .then(labels => {
          labels.forEach(label => {
            expect(label.label).to.exist;
          });
        });
      });
    });

    

  });
};