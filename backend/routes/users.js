const express = require('express');
const router = express.Router();
const admin = require('../utils/admin');
const db = admin.db;

router.post('createProfile', (req, res) => {
    const newProfile = {
        uname: req.body.name,
        posts: [],
        followers: [],
        following: []
    };
    db.collection('users').doc(req.body.email).set(newProfile).then((doc) => {
        res.json({
            message: `document ${doc.id} created successfully`
        });
    })
    .catch((err) => {
        res.status(500).json({ error: 'error while creating profile' });
    });
});


module.exports = router;