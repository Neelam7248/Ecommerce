if(process.env.NODE_ENV!=='production'){
    require('dotenv').config();
}
const express=require('express');
const app=express();
const cors=require('cors');
//const Client=require('../models/Client');
const mongoose=require('mongoose');

//const Route=require('../routes/Client');
//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for form-url-encoded data
const customerRoutes1 = require("./routes/Customer");

//app.use('api/Client',Route);

app.use("/api/customers",customerRoutes1);
app.use("/api/products", require("./routes/ProductRoute"));
app.use("/api/orders", require("./routes/OrderRoute"));

const customerRoutes = require("./routes/customer.route");
app.use("/api/customers", customerRoutes);



//connect to mongodb
mongoose.connect(process.env.DATABASE_URL);
const db=mongoose.connection;
db.on('error',error=>console.error('connection error:',error));
db.once('open',()=>console.log('connected to mongodb'));
//start server
const PORT=5000;
app.listen(process.env.PORT||5000,()=>{
    console.log('server is running on Port:5000')
});