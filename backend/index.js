const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const  mongoose = require('mongoose');
const cors = require('cors');

const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("database connected");
}).catch((err) => {
    console.log("database not connected", err);
})

app.use(express.json());
app.use(cors());
app.use('/user', userRoutes);


app.get("/", (req, res) => {
    res.send("hhhhhhhhhhh");
})



app.listen(PORT, () => {
    console.log("listening to port ....");
})
