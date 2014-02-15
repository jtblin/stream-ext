# stream-ext

Simple extensions for streams. You can pass a callback or listen on the stream.

## StringStream

Writable stream that outputs as a string, useful when you want to get the result of an http request as a
string after piping to gunzip for example.

    var request = require('http').request;
    var r = request({ hostname: 'www.apple.com', port: 80, headers: { 'Accept-Encoding' : 'gzip' } });
    r.on('response', function (resp) {
      var gunzip = require('zlib').createGunzip();
      var stream = require('../').StringStream();
      stream.on('end', function (body) {
        console.log(body);
      });
      resp.pipe(gunzip).pipe(stream);
    });
    r.end();

## BufferStream

Readable and writable buffer stream, useful when you receive an image in base64 and want to pipe it to a stream.

    var im = require('imagemagick-stream');
    var thumbnail = im().thumbnail('150x150').quality(90);
    var bs = require('stream-ext').BufferStream;

    // assuming you receive an image base64 string and want to upload to your bucket
    upload(myBucketUrl, image);

    function upload(url, img) {
      var out = new bs(), image = new bs(new Buffer(img, 'base64'));
      out.on('end', function (data) {
        s3.upload(config.s3.bucket, {Key: url, Body: data, ContentType: 'image/jpeg'})
      });

      image.pipe(thumbnail).pipe(out);
    }