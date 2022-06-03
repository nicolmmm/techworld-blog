const router = require("express").Router();
const { Blogs, Comments, User } = require("../models");
const withAuth = require("../utils/auth");

router.get("/", async (req, res) => {
  try {
    const blogData = await Blogs.findAll({ include: Comments });

    res.status(200).json(blogData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", withAuth, async (req, res) => {
  try {
    const blogData = await Blogs.findByPk(req.params.id, {
      include: [
        {
          model: User,
        },
        {
          model: Comments,
          include: User,
        },
      ],
    });
    const blog = blogData.get({ plain: true });
    console.log("blog is **********", blog);
    res.render("blogpost", {
      blog,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const blogData = await Blogs.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json(blogData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    console.log(req.session, "hitting HERE");

    const blogData = await Blogs.create({
      title: req.body.title,
      body: req.body.body,
      userId: req.session.userId,
    });

    res.status(200).json(blogData);
  } catch (err) {
    console.log("ERROR *********", err);
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const blogData = await Blogs.destroy({ where: { id: req.params.id } });

    res.status(200).json(blogData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
