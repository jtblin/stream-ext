var Stream = require('stream').Stream, util = require('util');

function BufferStream (data, onEnd) {
  if (! (this instanceof BufferStream)) return new BufferStream(data, onEnd);

  Stream.call(this);
  this.writable = true;
  this.readable = true;
  if (data instanceof Buffer) {
    this.data = data;
    this.size = this.maxSize = data.length;
  } else {
    this.data = new Buffer(0);
    this.size = 0;
    this.maxSize = 0;
  }
  if (typeof data === 'function') this.callback = data;
  else if (typeof onEnd === 'function') this.callback = onEnd
}
util.inherits(BufferStream, Stream);

// writable API
BufferStream.prototype.write = function (data) {
  if (data && data.length) {
    if (this.size + data.length > this.maxSize) {
      var newBuffer = new Buffer(this.size + data.length);
      this.data.copy(newBuffer, 0, 0, this.size);
      this.data = newBuffer;
    }
    data.copy(this.data, this.size, 0, data.length);
    this.size += data.length
  }
};

BufferStream.prototype.end = function (data) {
  this.write(data);
  this.callback ? this.callback(null, this.data) : this.emit('end', this.data)
};

BufferStream.prototype.error = function (err) {
  this.callback ? this.callback(err) : this.emit('error', err)
};

BufferStream.prototype.toString = function () {
  return this.data.toString('base64')
};

// readable API
BufferStream.prototype.pipe = function(dest, options) {
  Stream.prototype.pipe.call(this, dest, options);
  this.resume();
  return dest;
};

BufferStream.prototype.resume = function () {
  this.emit('data', this.data);
  this.emit('end');
  this.emit('close')
};

BufferStream.prototype.read = function (size) {
  if (! this.data || this.data.length < size) return null;

  size = size || undefined;
  var chunk = this.data.slice(0, size);
  this.data = size ? this.data.slice(size) : null;
  return chunk;
};

BufferStream.pause = function () {};

BufferStream.prototype.destroy = function () {
  delete this.data
};

module.exports = BufferStream;
