const mongoose = require("mongoose");
const app = require('./app')

app.listen(3000, () => {
  console.log("Server running. Use our API on port: 3000")
})


mongoose

  
  .connect(process.env.MONGO_URL)
  .then(console.log("Database connection successful"))
  .catch(error => {
    console.log(error);
    process.exit(1);
  });