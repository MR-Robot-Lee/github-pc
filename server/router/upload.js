const express = require('express');
const router = express.Router();
const request = require('request');
const { multipartyRequestHandler, streamToBuffer } = require('./uploader');
const api = require('../apiJson');

router.post('/', (req, res)=> {
  upload(req, res)
});

async function upload (req, res) {
  const transformStream = await multipartyRequestHandler(req);
  if (!transformStream) {
    return res.send('');
  }
  const buffer = await streamToBuffer(transformStream);
  request({
    method: 'POST',
    url: api.apiUrl + '/attach/upload',
    json: true,
    formData: {
      file: {
        value: buffer,
        options: {
          filename: transformStream.filename,
          contentType: transformStream.headers['content-type']
        }
      }
    }
  }, (err, resp, body)=> {
    if (err) {
      res.send({ error: 1, message: "上传失败" })
    }
    if (body.code === 1) {
      res.send({ error: 0, url: api.apiUrl + body.data.attachUrl });
    } else {
      res.send({ error: 1, message: "上传失败" })
    }
  });
}


module.exports = router;