var Stream = require('stream').Stream, util = require('util');

function StringStream (cb) {
  if (! (this instanceof StringStream)) return new StringStream(cb);

  Stream.call(this);
  this.writable = true;
  this.buffer = "";
  if (typeof cb === 'function') this.callback = cb;
}
util.inherits(StringStream, Stream);

StringStream.prototype.write = function (data) {
  if (data && data.length)
    this.buffer += data.toString();
};

StringStream.prototype.end = function (data) {
  this.write(data);
  this.callback ? this.callback(null, this.toString()) : this.emit('end', this.toString());
};

StringStream.prototype.error = function (err) {
  this.callback ? this.callback(err) : this.emit('error', err);
};

StringStream.prototype.toString = function () {
  return this.buffer;
};

module.exports = StringStream;

