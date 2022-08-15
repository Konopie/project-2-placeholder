const router = require('express').Router();
const {Post, Comment, User} = require('../models');
const sequelize = require('sequelize');

router.get('/', (req, res)=>{
    Post.findAll({
        attributes: [
          'id',
          'post_url',
          'post_text',
          'user_id'
        ],
        include: [
          {
            model: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id'],
            include: {
              model: User,
              attributes: ['username']
            }
          },
          {
            model: User,
            attributes: ['username']
          }
        ]
      }).then(dbPostData => {
        const posts = dbPostData.map(post => post.get({ plain: true }));

        res.render('home', { posts, loggedIn: req.session.loggedIn });
      })
    
})

router.get('/post/:id', (req, res)=>{
  Post.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
      'id',
      'post_url',
      'post_text',
      'user_id'
    ],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
    .then(dbPostData => {
      console.log(dbPostData)
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }

      // serialize the data
      const post = dbPostData.get({ plain: true });
      console.log(post)

      // pass data to template
      res.render('single-post', {post, loggedIn: req.session.loggedIn});
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
})

router.get('/login', (req, res) => {
    if(req.session.loggedIn){
        res.redirect('/');
        return;
    }

    res.render('login');
})

module.exports = router;