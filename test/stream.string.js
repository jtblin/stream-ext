describe('StringStream', function () {

  var StringStream = require('../lib/string-stream');
  it('writes data to the string', function (done) {
    var stream = new StringStream();
    stream.on('end', function (string) {
      string.should.be.equal('foobar');
      done();
    });
    stream.write('foo');
    stream.end('bar');
  });

  it('returns data with a callback', function (done) {
    var stream = new StringStream(function (err, string) {
      string.should.be.equal('foobar');
      done();
    });
    stream.write('foo');
    stream.end('bar');
  });

  it('bubbles errors up', function (done) {
    var stream = new StringStream();
    stream.on('error', function (err) {
      err.message.should.be.equal('foobar');
      done();
    });
    stream.write('foo');
    stream.error(new Error('foobar'));
  });

});
