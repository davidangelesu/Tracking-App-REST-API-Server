const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const port = process.env.PORT || 3000;

const userRouter = require("./routes/userRoutes");
const projectRouter = require("./routes/projectRoutes");
const beaconsRouter = require("./routes/beaconsRoutes");
const trackedEntitiesRouter = require("./routes/tracked-entitesRoutes");
const socketIo = require("./util/SocketIO/socketIo");

const corsMiddleware = require("./middlewares/CORS/cors");
//-------------------------------------------------------------
dotenv.config();
// creates & updates Token for Bimplus API
require("./config/bimPlusTokenGenerator")(app);

//-------------------------------------------------------------
//connect to DB
mongoose.connect(
	//process.env.DB_CONNECT,
	process.env.DB_DEVELOPMENT,
	{ useUnifiedTopology: true, useNewUrlParser: true },
	() => console.log("connected to DB!")
);
//-------------------------------------------------------------
//Middlewares
//to parse incoming requests
app.use(express.json());

//Middleware for preventing CORS Errors
app.use(corsMiddleware);

//Documentation route
app.use("/api-docs", express.static("./docs"));

//userRouter Routes
app.use("/user", userRouter);
//ProjectRouters Routes
app.use("/projects/", projectRouter);

//beaconsRouter Routes
app.use("/projects/", beaconsRouter);

//Tracking Entities Router
app.use("/projects/", trackedEntitiesRouter);

//Error Middleware
app.use((error, req, res, next) => {
	console.log(error);
	const status = error.statusCode || 500;
	const message = error.message;
	const data = error.data;
	return res.status(status).json({ message: message, data: data });
});
//-------------------------------------------------------------
//start application
const server= app.listen(port, () => {
	console.log("Server Up and running at Port :" + port);
});

//-------------------------------------------------------------
//sets up the Socket Io on the Server
const io = new socketIo(server);

