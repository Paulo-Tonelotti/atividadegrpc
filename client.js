var PROTO_PATH = __dirname + "/../../protos/helloworld.proto";

var parseArgs = require("minimist");
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

function main() {
  client.getMessage({ id: "1" }, function (err, response) {
    console.log("Get Message reposta com erro:", err.message);
  });

  client.createMessage(
    { content: "Aula TE", author: "Ricardo Sabatine" },
    function (err, response) {
      console.log("Create Message reposta:", response.id);

      client.getMessage({ id: response.id }, function (err, response) {
        console.log(
          "Get Message reposta:",
          response.content + " " + response.author
        );
      });

      client.updateMessage(
        {
          id: response.id,
          content: "Aula Topicos",
          author: "Ricardo Sabatine",
        },
        function (err, response) {
          console.log("Update message reposta:", response.id);
        }
      );

      client.getMessage({ id: response.id }, function (err, response) {
        console.log(
          "Get Message reposta:",
          response.content + " " + response.author
        );
      });
    }
  );
}

main();
