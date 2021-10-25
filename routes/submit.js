const express = require('express');
const formidable = require('formidable');
const { BlobServiceClient } = require('@azure/storage-blob');
const urlCrypt = require('url-crypt')(process.env.CRYPTO_KEY);
const eventUserUpload = require('../models/eventUserUpload');

const router = express.Router();

router.get('/upload/:hash', (req, res) => res.render('submit/upload.ejs', { discordUser: urlCrypt.decryptObj(req?.params?.hash) }));
router.get('/puzzle', (req, res) => {
  res.status(200);
  res.redirect('https://www.jigsawplanet.com/?rc=play&pid=0d90d095de94');
});

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
    const containerClient = blobServiceClient.getContainerClient(`wolfteam/events/halloween/${fields?.userID}`);
    const blockBlobClient = containerClient.getBlockBlobClient(files.fileUpload.name);

    blockBlobClient.uploadFile(files.fileUpload.path)
      .then(async () => {
        console.log(`File uploaded: https://cdn.wolfteam.info/wolfteam/events/halloween/${fields?.userID}/${files.fileUpload.name}`);
        await eventUserUpload.findOneAndUpdate({ userID: fields?.userID, event: fields?.event }, {
          IGN: fields?.ign,
          URL: `https://cdn.wolfteam.info/wolfteam/events/halloween/${fields?.userID}/${files.fileUpload.name}`,
          upload_date: new Date(),
        }, { upsert: true });
      })
      .catch((error) => console.error(error));

    /* console.log(files.fileUpload.path);
    console.log(files.fileUpload.name);
    console.log(files.fileUpload.type); */

    res.status(200);
    res.redirect('https://i.pinimg.com/564x/df/e1/0d/dfe10d8526fed5753614709613af8ee2.jpg');
  });
});

module.exports = router;
