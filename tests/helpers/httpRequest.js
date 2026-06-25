const http = require('http');
const { Readable, Duplex } = require('stream');

async function performRequest(
  app,
  { method = 'GET', path = '/', headers = {}, body } = {}
) {
  return new Promise((resolve, reject) => {
    const payload =
      body === undefined
        ? null
        : Buffer.from(typeof body === 'string' ? body : JSON.stringify(body));
    const normalizedHeaders = Object.keys(headers).reduce(
      (accumulator, key) => {
        accumulator[key.toLowerCase()] = headers[key];
        return accumulator;
      },
      {}
    );
    const request = new Readable({
      read() {
        if (payload) {
          this.push(payload);
        }

        this.push(null);
      },
    });

    request.url = path;
    request.method = method;
    request.headers = normalizedHeaders;

    if (payload && !request.headers['content-length']) {
      request.headers['content-length'] = String(payload.length);
    }

    request.connection = request.socket = new Duplex({
      read() {},
      write(_chunk, _encoding, callback) {
        callback();
      },
    });
    request.httpVersion = '1.1';
    request.httpVersionMajor = 1;
    request.httpVersionMinor = 1;

    const response = new http.ServerResponse(request);
    const chunks = [];
    const socket = new Duplex({
      read() {},
      write(_chunk, _encoding, callback) {
        callback();
      },
    });

    socket.destroy = () => {};
    socket.cork = () => {};
    socket.uncork = () => {};
    response.assignSocket(socket);

    const originalWrite = response.write.bind(response);
    const originalEnd = response.end.bind(response);

    response.write = (chunk, encoding, callback) => {
      if (chunk) {
        chunks.push(Buffer.from(chunk));
      }

      return originalWrite(chunk, encoding, callback);
    };

    response.end = (chunk, encoding, callback) => {
      if (chunk) {
        chunks.push(Buffer.from(chunk));
      }

      return originalEnd(chunk, encoding, callback);
    };

    response.on('finish', () => {
      const rawBody = Buffer.concat(chunks).toString('utf-8');
      const contentType = response.getHeader('content-type');
      const parsedBody =
        typeof contentType === 'string' &&
        contentType.includes('application/json') &&
        rawBody
          ? JSON.parse(rawBody)
          : rawBody;

      resolve({
        status: response.statusCode,
        headers: response.getHeaders(),
        text: rawBody,
        body: parsedBody,
      });
    });

    response.on('error', reject);
    app.handle(request, response, reject);
  });
}

module.exports = { performRequest };
