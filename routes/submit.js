const express = require('express');
const formidable = require('formidable');
const { BlobServiceClient } = require('@azure/storage-blob');

const router = express.Router();

router.get('/upload', (req, res) => res.render('submit/upload.ejs'));

router.post('/upload', (req, res, next) => {
  const form = formidable({ multiples: true });

  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }

    // Upload files to Azure
    const blobServiceClient = BlobServiceClient
      .fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient('wolfteam/events/halloween');
    const blockBlobClient = containerClient.getBlockBlobClient(files.fileUpload.name);

    blockBlobClient.uploadFile(files.fileUpload.path)
      .then(() => console.log(`File uploaded: https://cdn.wolfteam.info/wolfteam/events/halloween/${files.fileUpload.name}`))
      .catch((error) => console.error(error));

    /* console.log(files.fileUpload.path);
    console.log(files.fileUpload.name);
    console.log(files.fileUpload.type); */

    res.status(200);
    res.redirect('/submit/upload');
  });
});

module.exports = router;
