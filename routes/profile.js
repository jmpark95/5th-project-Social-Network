const router = require('express').Router();
const profileController = require('../controllers/profileController')
const requireAuth = require('../middleware/requireAuth')
const upload = require("../middleware/multer");

router.get('/:id', requireAuth, profileController.profile_get)
router.post('/createpost', requireAuth, upload.single("file"), profileController.createpost_post)

module.exports = router