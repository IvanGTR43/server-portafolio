const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = require("./app");
const port = process.env.PORT || 3977;
const portDB = 27017;
const{APLI_VESION, IP_SERVER, PORT_DB, API_VERSION} = require("./config");
mongoose.set("useFindAndModify", false);
mongoose.connect(`mongodb://${IP_SERVER}:${PORT_DB}/ivangtr`,{useNewUrlParser: true, useUnifiedTopology: true}, (err, res)=> {
    if(err){
        throw err
    }else{
        console.log("Conexion a bd correcta");
        app.listen(port, ()=> {
            console.log("Api Rest");
            console.log(`http://${IP_SERVER}:${port}/api/${API_VERSION}`);
        })
    }
});