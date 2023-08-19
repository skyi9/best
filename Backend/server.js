const app = require("./app");
const connectDB = require("./config/db");


connectDB();

app.listen(process.env.PORT, () => {
    console.log(`server connected at port : ${process.env.PORT}`);
})