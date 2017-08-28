var models = require('./models');



module.exports.getUserByEmail = (email) => {
  return models.users.findOne({
    where: {email}
  })
  .then((user) => {
    if (user) {
      return user;
    } else {
      return new Promise((resolve, reject) => {
        reject('There is no user registered under the email ' + email);
      });
    }
  });
};



module.exports.getTrailsByName = (name) => {
  if (!name || name.constructor !== String) {
    return new Promise((resolve, reject) => {
      reject('Expected a string but instead was passed in ' + name);
    });
  }

  return models.trails.findAll({
    where: {name}
  })
  .then((trails) => {
    for (let i = 0; i < trails.length; i++) {
      trails[i].latitude = parseFloat(trails[i].latitude);
      trails[i].longitude = parseFloat(trails[i].longitude);
    }
    return trails;
  });
};

module.exports.getTrailById = (id) => {
  return models.trails.findOne({
    where: {id}
  })
  .then((trail) => {
    trail.latitude = parseFloat(trail.latitude);
    trail.longitude = parseFloat(trail.longitude);
    return trail;
  });
};

module.exports.getAllTrails = () => {
  return models.trails.findAll()
  .then((trails) => {
    for (let i = 0; i < trails.length; i++) {
      trails[i].latitude = parseFloat(trails[i].latitude);
      trails[i].longitude = parseFloat(trails[i].longitude);
    }
    return trails;
  });
};

module.exports.toggleLikePost = (user_id, post_id) => {
  let query0 = `
  UPDATE likes L
  SET L.like = CASE WHEN L.like = 1 THEN 0 ELSE 1 END
  WHERE L.userId = ${user_id}
  AND L.postId = ${post_id};`

  let query1 = `
  INSERT INTO likes (postId, userId, createdAt, updatedAt)
  SELECT ${post_id}, ${user_id}, NOW(), NOW()
  FROM (SELECT 1 AS dummy) dummy_table
  WHERE NOT EXISTS (SELECT NULL
                    FROM likes L2
                    WHERE L2.postId = ${post_id}
                    AND L2.userId = ${user_id}
                  );`

  let query2 = `
  SELECT p.id, p.title, p.text, p.image_url, p.view_count, p.flag_count, p.longitude, p.createdAt, p.updatedAt, p.poster_user_id, p.trail_id, (
    SELECT SUM(l.like)
    FROM likes l
    WHERE l.postId = p.id) AS totalLikes,
    MAX(CASE WHEN l.like = 1 AND l.userId = ${user_id} AND l.postId = p.id THEN 1 ELSE 0 END) AS likedByCurrentuser
  FROM posts p LEFT JOIN likes l
  ON p.id = l.postId
  GROUP BY p.id, p.title, p.text, p.image_url, p.view_count, p.flag_count, p.longitude, p.createdAt, p.updatedAt, p.poster_user_id, p.trail_id
  ORDER BY p.updatedAt DESC`;

  return models.sequelize.query(query0 + query1 + query2).spread((posts, metadata) => {
    // Results will be an empty array and metadata will contain the number of affected rows.
    return replaceReferenceModelIdsWithModels(posts[posts.length - 1], 'poster_user_id', models.users, 'poster');
  });
};

module.exports.getAllPosts = (currentUserId) => {
  let query = `SELECT p.id, p.title, p.text, p.image_url, p.view_count, p.flag_count, p.longitude, p.createdAt, p.updatedAt, p.poster_user_id, p.trail_id, (
    SELECT SUM(l.like)
    FROM likes l
    WHERE l.postId = p.id) AS totalLikes,
    MAX(CASE WHEN l.like = 1 AND l.userId = ${currentUserId} AND l.postId = p.id THEN 1 ELSE 0 END) AS likedByCurrentuser
  FROM posts p LEFT JOIN likes l
  ON p.id = l.postId
  GROUP BY p.id, p.title, p.text, p.image_url, p.view_count, p.flag_count, p.longitude, p.createdAt, p.updatedAt, p.poster_user_id, p.trail_id
  ORDER BY p.updatedAt DESC`;

  return models.sequelize.query(query).spread((posts, metadata) => {
    // Results will be an empty array and metadata will contain the number of affected rows.
    return replaceReferenceModelIdsWithModels(posts, 'poster_user_id', models.users, 'poster');
  });
};

module.exports.createTrail = (id, name, description = '', directions = '', latitude = 0, longitude = 0, city = '', state = '', length = 0, activity_type = '') => {
  if (!name || name.constructor !== String) {
    return new Promise((resolve, reject) => {
      reject('Expected trail name to be a non-empty string, but instead got ' + name);
    });
  }
  if (directions === undefined || directions === null || directions.constructor !== String) {
    return new Promise((resolve, reject) => {
      reject('Expected trail directions to be a string, but instead got ' + directions);
    });
  }

  return models.trails.findOne({
    where: {id}
  })
  .then((trail) => {
    // If a trail with this ID already exist, don't attempt to create another one
    if (trail) {
      trail.latitude = parseFloat(trail.latitude);
      trail.longitude = parseFloat(trail.longitude);
      return trail;
    }
    return models.trails.create({
      id, name, description, directions, latitude, longitude, city, state, length, activity_type
    });
  });
};



// posterData can be either a user ID or a user email (REMEMBER: user IDs are STRINGS, NOT numbers)
// trailData can be either a trail ID or a trail name
// posterDataType should either be 'id' or 'email'
module.exports.createPost = (posterEmail, trailId, title, text, imageUrl, latitude=0, longitude=0) => {
  if (!posterEmail || posterEmail.constructor !== String) {
    return new Promise((resolve, reject) => {
      reject('Expected poster email to be a string, but instead it was ' + posterEmail);
    });
  }
  if (!title || title.constructor !== String) {
    return new Promise((resolve, reject) => {
      reject('Expected title to be a string, but instead it was ' + title);
    });
  }
  if (!text || text.constructor !== String) {
    return new Promise((resolve, reject) => {
      reject('Expected text to be a string, but instead it was ' + text);
    });
  }
  if (!imageUrl || imageUrl.constructor !== String) {
    return new Promise((resolve, reject) => {
      reject('Expected image url to be a string, but instead it was ' + imageUrl);
    });
  }

  return module.exports.getUserByEmail(posterEmail)
  .then((poster) => {
    return models.posts.create({
      title,
      text,
      image_url: imageUrl,
      view_count: 0,
      flag_count: 0,
      latitude,
      longitude,
      poster_user_id: poster.id,
      trail_id: trailId
    });
  });
};

module.exports.getPostsByUserEmail = (email) => {
  return module.exports.getUserByEmail(email)
  .then((user) => {
    return models.posts.findAll({
      where: {
        poster_user_id: user.id
      }
    })
    .then((posts) => {
      for (let i = 0; i < posts.length; i++) {
        posts[i].latitude = parseFloat(posts[i].latitude);
        posts[i].longitude = parseFloat(posts[i].longitude);
        posts[i].poster_user_id = parseInt(posts[i].poster_user_id);
      }
      return replaceReferenceModelIdsWithModels(posts, 'poster_user_id', models.users, 'poster');
    });
  });
};

module.exports.getPostsByTrailId = (id) => {
  return models.posts.findAll({
    where: {trail_id: id},
    order: [['updatedAt', 'DESC']]
  })
  .then((posts) => {
    for (let i = 0; i < posts.length; i++) {
      posts[i].latitude = parseFloat(posts[i].latitude);
      posts[i].longitude = parseFloat(posts[i].longitude);
      posts[i].poster_user_id = parseInt(posts[i].poster_user_id);
    }
    return replaceReferenceModelIdsWithModels(posts, 'poster_user_id', models.users, 'poster');
  });
};

module.exports.likePost = (user_id, post_id) => {
  return models.likes.findAll({
    where: {
      userId: user_id,
      postId: post_id
    }
  })
  .then(results => {
    if (!results.length) {
      return models.likes.create({
        userId: user_id,
        postId: post_id,
        like: true
      });
    } else {
      return models.likes.update({
        like: true}, {
        where: {
          userId: user_id,
          postId: post_id}
      });
    }
  });
};

module.exports.unlikePost = (user_id, post_id) => {
  return models.likes.update({
    like: false}, {
    where: {
      userId: user_id,
      postId: post_id}
  });
};

module.exports.createLabels = (labelEntries) => {
  return models.labels.bulkCreate(labelEntries);
};

module.exports.findLabelsByPostId = (postId) => {
  return models.labels.findAll({
    where: {post_id: postId}
  });
};

module.exports.getAllLabels = () => {
  return models.labels.findAll({attributes: ['label']});
};

module.exports.searchPosts = (query) => {
  var queryStr = `select * from posts where id in (select post_id from labels where label like '%${query}%' group by post_id);`;
  return models.sequelize.query(queryStr, {type: models.sequelize.QueryTypes.SELECT})
  .then(posts => {
    return replaceReferenceModelIdsWithModels(posts, 'poster_user_id', models.users, 'poster');
  });
};

// Used when getting an array of models that contain foreign keys
// and, for each instance in the array, will replace the foreign
// key with the model it is pointing to
//
// modelArray - the array of existing models where each model contains a foreign ID
// idToReplace - a string representing the name of the foreign key that will be replaced
// modelToReplaceWith - the sequelize model that will be searched for using the foreign key
// modelKey - the key where the new foreign-referenced model will be replaced within each element of modelArray
let replaceReferenceModelIdsWithModels = (modelArrayImmutable, idToReplace, modelToReplaceWith, modelKey) => {
  let modelArray = JSON.parse(JSON.stringify(modelArrayImmutable));
  let getModelPromises = []; // An array of promises, one for each model in the model array
  modelArray.forEach((model) => {
    let referenceModelId = model[idToReplace];
    delete model[idToReplace];
    getModelPromises.push(
      modelToReplaceWith.findOne({
        where: {
          id: referenceModelId
        }
      })
      .then((referenceModel) => {
        model[modelKey] = referenceModel;
        return model;
      })
    );
  });
  return Promise.all(getModelPromises)
  .then(() => {
    return modelArray;
  });
};
