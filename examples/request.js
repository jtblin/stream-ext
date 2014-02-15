var request = require('http').request;
var r = request({ hostname: 'www.apple.com', port: 80, headers: { 'Accept-Encoding' : 'gzip' } });
r.on('response', function (resp) {
  console.log('res.statusCode', resp.statusCode);
  var gunzip = require('zlib').createGunzip();
  var stream = require('../').StringStream();
  stream.on('end', function (body) {
    console.log(body);
  });
  resp.pipe(gunzip).pipe(stream);
});
r.end();
