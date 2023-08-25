var PROTO_PATH = __dirname + "/../../protos/helloworld.proto";

var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
var hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;

var fakeDatabase = {};

function createMessage(call, callback) {
  var id = require("crypto").randomBytes(10).toString("hex");

  fakeDatabase[id] = call.request;

  callback(null, {
    id: id,
    content: call.request.content,
    author: call.request.author,
  });
}

function getMessage(call, callback) {
  id = call.request.id;
  if (!fakeDatabase[id]) {
    return callback({
      code: 400,
      message: "id não encontrado",
      status: grpc.status.INVALID_ARGUMENT,
    });
  }
  request = fakeDatabase[id];
  callback(null, { id: id, content: request.content, author: request.author });
}

function updateMessage(call, callback) {
  id = call.request.id;
  if (!fakeDatabase[id]) {
    return callback({
      code: 400,
      message: "id não encontrado",
      status: grpc.status.INVALID_ARGUMENT,
    });
  }
  fakeDatabase[id] = call.request;
  callback(null, {
    id: id,
    content: call.request.content,
    author: call.request.author,
  });
}

function main() {
  var server = new grpc.Server();
  server.addService(hello_proto.Greeter.service, {
    createMessage: createMessage,
    getMessage: getMessage,
    updateMessage: updateMessage,
  });
  server.bindAsync(
    "0.0.0.0:50051",
    grpc.ServerCredentials.createInsecure(),
    () => {
      server.start();
    }
  );
}

main();
