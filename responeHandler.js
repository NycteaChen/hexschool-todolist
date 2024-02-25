const codeMessageEnum = Object.freeze({
  400: "欄位未填寫正確，或無此 todo id",
  404: "無此路由",
});

const responeHandler = (res, code, data, headerType = "application/json") => {
  const headers = {
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Content-Length, X-Requested-With",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PATCH, POST, GET,OPTIONS,DELETE",
    "Content-Type": headerType,
  };
  res.writeHead(code, headers);

  switch (code) {
    case 200:
      if (Array.isArray(data)) {
        res.write(
          JSON.stringify({
            status: "success",
            data,
          })
        );
      }
      break;
    default:
      res.write(
        JSON.stringify({
          status: "false",
          message: codeMessageEnum[code],
        })
      );
      break;
  }

  res.end();
};

module.exports = responeHandler;
