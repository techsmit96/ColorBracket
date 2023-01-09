const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
// const cron = require('node-cron');

var fs = require("fs");

dotenv.config({ path: "./config/config.env" });

//Middlewares
const errorHandler = require("./middleware/error");
const { protect, authorize } = require("./middleware/auth");

//Routes files
const userRoute = require("./routes/user.routes");
const recipeRoute = require("./routes/recipe.routes");
const ingredientRoute = require("./routes/ingredient.routes");
const processRoute = require("./routes/process.routes");

//Request logger
const morgan = require("morgan");

const app = express();
app.use(compression()); // Compress all routes
app.use(helmet());
app.use(helmet.xssFilter());
app.use(cors());
app.use(express.static("public"));
app.use(express.static("./uploads"));
//Body parser
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Cookie parser
app.use(cookieParser());
// app.use(express.static('./public'));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// var publicDir = require('path').join(__dirname, process.env.DOCS);
// app.use('/gatepass', express.static(`${process.env.DOCS}/Gate-Pass`));

//Routes
app.use("/api/auth", userRoute);
app.use("/api/recipe", recipeRoute);
app.use("/api/ingredient", ingredientRoute);
app.use("/api/process", processRoute);

//Error Handler
app.use(errorHandler);

// Read HTML Template

const db = require("./models");
// const {
// 	getLowStockAlertEmail,
// 	cronJob,
// } = require('./controllers/low_stock_alert');
// cron.schedule('05 9 * * *', () => {
// 	console.log('11111');
// 	// getLowStockAlertEmail();
// 	cronJob();
// });

db.sequelize
  .sync()
  .then(() => {
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
          .bold
      );
    });
  })
  .catch((err) => console.log(err));
