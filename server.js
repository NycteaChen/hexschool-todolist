const http = require("http");
const { CLIENT_RENEG_WINDOW } = require("tls");
const { v4: uuidv4 } = require("uuid");
const responeHandler = require("./responeHandler");

const todoList = [];

const requestListener = (req, res) => {
  const headers = {
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Content-Length, X-Requested-With",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PATCH, POST, GET,OPTIONS,DELETE",
    "Content-Type": "application/json",
  };

  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  if (req.url === "/todos" && req.method === "GET") {
    responeHandler(res, 200, todoList);
  } else if (req.url === "/todos" && req.method === "POST") {
    req.on("end", () => {
      try {
        const { title } = JSON.parse(body);
        if (title !== undefined) {
          todoList.push({
            title,
            id: uuidv4(),
          });
          responeHandler(res, 200, todoList);
        } else {
          responeHandler(res, 400);
        }
      } catch {
        responeHandler(res, 400);
      }
    });
  } else if (req.url === "/todos" && req.method === "DELETE") {
    todoList.length = 0;
    responeHandler(res, 200, todoList);
  } else if (req.url.startsWith("/todos/") && req.method === "DELETE") {
    const id = req.url.split("/").pop();
    const index = todoList.findIndex((e) => e.id === id);
    if (index !== -1) {
      todoList.splice(index, 1);
      responeHandler(res, 200, todoList);
    } else {
      responeHandler(res, 400);
    }
  } else if (req.url.startsWith("/todos/") && req.method === "PATCH") {
    req.on("end", () => {
      try {
        const { title } = JSON.parse(body);
        const id = req.url.split("/").pop();
        const index = todoList.findIndex((e) => e.id === id);

        if (title !== undefined && index !== -1) {
          todoList[index].title = title;
          responeHandler(res, 200, todoList);
        } else {
          responeHandler(res, 400);
        }
      } catch {
        responeHandler(res, 400);
      }
    });
  } else if (req.url === "/todos" && req.method === "OPTIONS") {
    responeHandler(res, 200);
  } else {
    responeHandler(res, 404);
  }
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3005);
