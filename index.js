const express = require("express");
const app = express();
const fs = require("fs");
app.use(express.json());

let data;
try {
  data = JSON.parse(fs.readFileSync(`${__dirname}/data.json`));
  console.log("The required data", data);
} catch (error) {
  console.log("Error fetched", error.message);
}
app.get("/info", (request, response) => {
  response.status(200).json({
    data,
  });
});

app.post("/info", (request, response) => {
  const newId = data[data.length - 1].id + 1;
  const newData = Object.assign({ id: newId }, request.body);
  data.push(newData);
  fs.writeFile(`${__dirname}/data.json`, JSON.stringify(data), (err) => {
    response.status(200).json({
      status: "success",
      data: {
        newData,
      },
    });
  });
});
app.get("info/:id", (request, response) => {
  const id = Number(request.params.id);
  const datas = data.filter((element) => element.id === id);
  if (datas.length === 0) {
    return response.status(404).json({
      status: "fail",
    });
  }
  response.status(200).json({
    status: "success",
    data: {
      datas,
    },
  });
});
app.get("info/:id", (request, response) => {

    if (request.params.id > data.length) {
      return response.status(404).json({
        status: "fail",
      });
    }
    response.status(200).json({
      status: "success",
      data: {
      data
      },
    });
  });

  app.delete("info/:id", (request, response) => {

    if (request.params.id > data.length) {
      return response.status(404).json({
        status: "fail",
      });
    }
    response.status(200).json({
      status: "success",
      data: null,
    });
  });



const port = 3000;
app.listen(port, () => {
  console.log("CRUD Exercise");
});
