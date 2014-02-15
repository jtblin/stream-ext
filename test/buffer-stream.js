describe('BufferStream', function () {

  var BufferStream = require('../lib/buffer-stream');
  describe('Writable', function () {
    it('writes data to the buffer', function (done) {
      var stream = new BufferStream();
      stream.on('end', function (buffer) {
        buffer.toString().should.be.equal('foobar');
        done();
      });
      stream.write(new Buffer('foo'));
      stream.end(new Buffer('bar'));
    });

    it('initializes data to the buffer', function (done) {
      var stream = new BufferStream(new Buffer('foo'));
      stream.on('end', function (buffer) {
        buffer.toString().should.be.equal('foobar');
        done();
      });
      stream.end(new Buffer('bar'));
    });

    it('returns data with a callback', function (done) {
      var stream = new BufferStream(function (err, buffer) {
        buffer.toString().should.be.equal('foobar');
        done();
      });
      stream.write(new Buffer('foo'));
      stream.end(new Buffer('bar'));
    });

    it('bubbles errors up', function (done) {
      var stream = new BufferStream();
      stream.on('error', function (err) {
        err.message.should.be.equal('foobar');
        done();
      });
      stream.write(new Buffer('foo'));
      stream.error(new Error('foobar'));
    });
  });

  describe('Readable', function () {
    it('pipes in and out', function (done) {
      var i = new BufferStream(new Buffer('foobar'));
      var o = new BufferStream();
      o.on('end', function (buffer) {
        buffer.toString().should.be.equal('foobar');
        done();
      });
      i.pipe(o);
    });

    it('reads from the buffer until it is drained', function () {
      var stream = new BufferStream(new Buffer('foobar'));
      stream.read(3).toString().should.be.equal('foo');
      stream.read(3).toString().should.be.equal('bar');
      expect(stream.read(3)).to.be.equal(null);
    });
  });

});
