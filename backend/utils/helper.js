const util = require('util');
const { format } = util;
const admin = require('./admin');

const uploadImage = (file) => new Promise((resolve, reject) => {
    const { originalname, buffer } = file
  
    const blob = admin.bucket.file(originalname.replace(/ /g, "_"))
    const blobStream = blob.createWriteStream({
        resumable: false
    })
  
    blobStream.on('finish', () => {
        const publicUrl = format(
            `https://storage.googleapis.com/${admin.bucket.name}/${blob.name}`
        )
        resolve(publicUrl)
    })
    .on('error', () => {
      reject(`Unable to upload image, something went wrong`)
    })
    .end(buffer);
})

module.exports = uploadImage;