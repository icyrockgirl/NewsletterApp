const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const request = require("request");
require("dotenv").config()

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html")
})

app.post("/", function(req,res){
    const firstName = req.body.fName
    const lastName = req.body.lName
    const email = req.body.email
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }
    const jsonData = JSON.stringify(data);
    const url = "https://" + MAPI_SERVER + ".api.mailchimp.com/3.0/lists/" + MLIST_ID
    const MAPI_KEY = process.env.API_KEY
    const MLIST_ID = process.env.LIST_ID
    const MAPI_SERVER = process.env.API_SERVER

    const options = {
        method: "POST",
        auth: "sub:" + MAPI_KEY
    }

    const request = https.request(url, options, function(response){
        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html")
        }
        else{
            res.sendFile(__dirname + "/failure.html")
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req,res){
   res.redirect("/")
})

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running")
})

