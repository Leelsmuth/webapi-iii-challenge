const express = require("express");

const users = require("./userDb");
const posts = require("../posts/postDb");
const router = express.Router();

//custom middleware
function validateUser(req, res, next) {
  let user = req.body;

  if (!user) {
    res.status(400).json({ message: "missing user data" });
  } else if (!user.name) {
    res.status(400).json({ message: "missing required name field" });
  } else {
    next();
  }
}

function validateUserId(req, res, next) {
  users
    .getById(req.params.id)
    .then(user => {
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(400).json({ message: "invalid user id" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message:
          "Something terrible happend while checking user id: " + error.message
      });
    });
}

function validatePost(req, res, next) {
  let post = req.body;

  if (!post) {
    res.status(400).json({ message: "missing post data" });
  } else if (!post.text) {
    res.status(400).json({ message: "missing required text field" });
  } else {
    next();
  }
}

//implement here
router.post("/", validateUser, (req, res) => {
  users
    .insert(req.body)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(error => {
      res.status(500).json({
        message: "Error adding the user: " + error.message
      });
    });
});

router.post("/:id/posts", validateUserId, (req, res) => {
  let { id } = req.params;
  let postBody = { ...req.body, user_id: id };
  posts
    .insert(postBody)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(err => {
      res.status(500).json({
        error: "we encountered an error while creating this post for the user"
      });
    });
});

router.get("/", (req, res) => {
  users
    .get(req.query)
    .then(post => {
      res.status(200).json(post);
    })
    .catch(error => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: "Error retrieving the hubs"
      });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  res.json(req.user);
});

router.get("/:id/posts", validateUserId, (req, res) => {
  users
    .getUserPosts(req.params.id)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      res.status(500).json({
        message:
          "encountered an error while retrieving the posts for the specified user"
      });
    });
});

router.delete("/:id", validateUserId, (req, res) => {
  users
    .remove(req.user.id)
    .then(() => {
      // throw new Error('artifitial error while deleting!');
      res.status(200).json({ message: "This user has been deleted" });
    })
    .catch(error => {
      res.status(500).json({
        message: `Error deleting the user: ${error.message}`
      });
    });
});

router.put("/:id", validateUserId, (req, res) => {
  users
    .update(req.user.id, req.body)
    .then(user => {
      res.status(200).json({
        message: "You have just changed his destiny"
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Error updating the user: " + error.message
      });
    });
});

module.exports = router;
