const { Router } = require("express");
const BLOG = require("../models/blog");
const COMMENT = require("../models/comment")
const multer = require('multer')
const path = require('path')

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./public/uploads"))
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`
    cb(null, fileName)
  }
})

const upload = multer({ storage: storage })

router.get('/add-new', (req, res) => {
    // console.log(req.user)
    return res.render('addBlog', {
        user: req.user
    })
})

router.get('/:_id', async (req, res) => {
    const _id = req.params._id
    const blog = await BLOG.findById(_id).populate('createdBy')
    const comments = await COMMENT.find({blogId: _id}).populate('createdBy')
    // console.log(blog)
    return res.render("blog", {blog, user: req.user, comments})
})

router.post('/', upload.single('coverImage'),async (req, res) => {
    // console.log(req.body)
    // console.log(req.file)
    const {title, body} = req.body
    const blog = await BLOG.create({
        body,
        title,
        createdBy: req.user._id,
        coverImageUrl: `/uploads/${req.file.filename}`
    })
    return res.redirect(`/blog/${blog._id}`)
})

router.post('/comment/:blogId', async (req, res) => {
    const comment = await COMMENT.create({
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user._id
    })
    // console.log(comment)
    return res.redirect(`/blog/${comment.blogId}`)
})

module.exports = router