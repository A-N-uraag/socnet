const express = require('express');
const router = express.Router();

router.get('/tweets', (req, res) => {
    const str = [{
        "name" : "Michael",
        "msg" : "F turtles",
        "username" : "mr2"
    }];
    res.end(JSON.stringify(str));

});


router.get('/', (req, res) => {
    res.end("This is home page");
});

router.post('postContent', (req, res) => {
    console.log(req.body);
    res.end("This is post page");
});

module.exports = router;