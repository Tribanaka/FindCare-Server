import { Readable } from 'stream';

export function bufferToStream(buffer: Buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null); // Indicates the end of stream
  return stream;
}
