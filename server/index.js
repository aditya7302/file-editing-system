const express = require("express");
const socket = require("socket.io");
const connectDB = require("./config/db");
const authRouter = require("./routes/auth.routes");
const DocsModel = require('./models/document.model');
const docsRouter = require("./routes/document.routes");
const profileRouter = require("./routes/profile.routes");
const authCheck = require("./middlewares/auth.middleware");
const { getSingleDoc } = require("./controllers/document.controller");
const cors = require("cors");

require('dotenv').config();

const app = express();

app.use(cors()); 
app.use(express.json()); 

app.get('/', async (req, res) => {
     try {
          res.status(200).send({ message: 'Welcome to homepage' });
     } catch (error) {
          console.log('error:', error)
          res.status(500).send({ message: 'Internal server error!', error });
     }
});


app.use("/auth", authRouter);

app.use('/docs', docsRouter);
app.use(authCheck);
app.use('/profile', profileRouter)


app.use('*', async (req, res) => {
     res.sendStatus(422); 
});


const server = app.listen(process.env.PORT || 8080, async () => {
     console.log(`Server running on port ${process.env.PORT || 8080}`);
     try {
          console.log('⏳ Database connecting...');
          await connectDB;
          console.log('✅ Database connected.');
     } catch (error) {
          console.log('❌ Error:', error);
     }
});


const io = socket(server, {
     cors: {
          // origin: 'https://doc-depot-by-atanu.vercel.app',
          origin: 'http://localhost:5173',
          methods: ['GET', 'POST', 'PATCH'],
     },
});

io.on("connection", socket => {
     socket.on("get-document", async documentId => {
          const document = await getSingleDoc(documentId);
          socket.join(documentId);
          socket.emit("load-document", document);

          socket.on("send-changes", delta => {
               socket.broadcast.to(documentId).emit("receive-changes", delta);
          });

          socket.on("save-document", async data => {
               await DocsModel.findByIdAndUpdate(documentId, { doc: data });
          });
     });
});
