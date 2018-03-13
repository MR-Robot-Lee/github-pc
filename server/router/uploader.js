const { Form } = require('multiparty');
const request = require('request');
const multipartyRequestHandler = (request, field = 'imgFile') => new Promise((reslove, reject) => {
  const form = new Form();
  let flag = false;
  form.on('part', (part) => {
    if (part.name === field) {
      flag = true;
      return reslove(part);
    }
    return part.resume();
  });
  form.on('end', () => {
    if (!flag) {
      reject(new Error('不能上传空文件!'));
    }
  });
  form.on('error', reject);
  form.parse(request);
});

const postImageServer = (stream)=>new Promise((reslove, reject)=> {
  const formData = {
    file: stream
  };
  request.post({
    url: 'https://gc.azhu.co/customer/attach/upload',
    formData: formData
  }, (err, response, body)=> {
    if (err) {
      reject(err);
    }
    reslove(response);
  })
});

const streamToBuffer = stream => new Promise((reslove, reject) => {
  let buffers = new Buffer(0);
  try {
    stream.on('data', data => (buffers = Buffer.concat([buffers, data])));
    stream.on('end', () => reslove(buffers));
  } catch (e) {
    reject(e);
  }
});

module.exports = { multipartyRequestHandler, postImageServer, streamToBuffer };