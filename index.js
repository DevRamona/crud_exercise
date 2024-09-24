const express = require("express");
const app = express();
const fs = require("fs");
app.use(express.json());

let data;
try {
  data = JSON.parse(fs.readFileSync(`${__dirname}/data.json`));
  return data
} catch (error) {
  console.log("Error fetched", error.message);
}
app.get('/getAll', (request, response) => {
  if(data) {
    response.status(200).json(data)
  } else {
    response.status(500).json("Data unavailable")
  }
})
// GET
app.get("/info/:id", (request, response) => {
  const { id } = request.params;

  const item = data.find((user) => user.id === Number(id));
  if (item) {
    return response.status(200).json({
      item,
    });
  } else {
    return response.status(500).json("The item is not found")
  }
});

// POST
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

// PUT
app.put("/info/:id", (request, response) => {
  const { id } = request.params;
  const updatedData = request.body;
  if(Object.keys(updatedData).length === 0){
    return response.status(400).json({
      message: "Request can't be empty"
    })
  }
  const index = data.findIndex((element) => element && element.id === Number(id));

  if (index === -1) { 
    return response.status(404).json({
      status: "fail",
      message: "item not found",
    });
  }

  data[index] = {id: Number(id), ...updatedData };

  fs.writeFile(
    `${__dirname}/data.json`,
    JSON.stringify(data, null, 2),
    (err) => {
      response.status(200).json({
        status: "success",
        data: data[index],
      });
    }
  );
});

app.patch("/info/:id", (request, response) => {
  const { id } = request.params;
  const updatedData = request.body;
  const index = data.findIndex((element) => element.id === Number(id));

  if (index === -1) {
    return response.status(404).json({
      status: "fail",
      message: "User not found",
    });
  }

  data[index] = { ...data[index], ...updatedData };

  fs.writeFile(
    `${__dirname}/data.json`,
    JSON.stringify(data, null, 2),
    (err) => {
      response.status(200).json({
        status: "success",
        data: data[index],
      });
    }
  );
});
// DELETE
app.delete("/info/:id", (req, res) => {
  const { id } = req.params;
  const index = data.findIndex((user) => user.id === Number(id));

  if (index === -1) {
    return res.status(404).json({ message: "Data not found" });
  }

  const deletedItem = data.splice(index, 1);

  fs.writeFile(
    `${__dirname}/data.json`,
    JSON.stringify(data, null, 2),
    (err) => {
      res.status(200).json({
        message: "Data Deleted Successfully",
        deletedItem,
      });
    }
  );
});

const port = 3000;
app.listen(port, () => {
  console.log("CRUD Exercise");
});
