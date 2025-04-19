const { encrypt, decrypt } = require('../utils/cryptoUtils');

function encryptRequestBody(req, res, next) {
  if (req.body.content) {
    req.body.content = encrypt(req.body.content);
  }
  next();
}

function decryptResponseBody(req, res, next) {
  const originalSend = res.send;
  res.send = function (data) {
    if (data && typeof data === 'object' && data.content) {
      data.content = decrypt(data.content);
    }
    originalSend.call(this, data);
  };
  next();
}

module.exports = { encryptRequestBody, decryptResponseBody };