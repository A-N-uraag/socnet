const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('./utils/admin');
const db = admin.db;
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/createuser', (req, res) => {
    console.log(req.body);
    const newProfile = {
        uname: req.body.uname || '',
        dob: req.body.dob || '',
        bio: req.body.bio || '',
        website: req.body.website || '',
        location: req.body.location || '',
        posts: [],
        likedPosts: [],
        followers: [],
        following: []
    };
    db.collection('users').doc(req.body.email).set(newProfile).then((doc) => {
        res.json({
            message: `user ${req.body.email} created successfully`
        });
    })
    .catch((err) => {
        res.status(500).json({ error: err });
    });
});

app.post('/createpost', (req, res) => {
    console.log(req.body);
    const newPost = {
        content: req.body.content || '',
        createdDate: new Date().toISOString(),
        likes: 0,
        comments: [],
        reposts: 0,
        noOfReports: 0,
        postedBy: req.body.user || ''
    };
    var docId;
    db.collection('posts').add(newPost)
    .then((docu) => {
        docId = docu.id;
        return db.collection('users').doc(req.body.user).update({
            posts: admin.admin.firestore.FieldValue.arrayUnion(docu.id)
        });
    })
    .then((res) => {
        return {res:res,doc:docId};
    })
    .then((resp)=>{
        res.json(resp);
    });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
