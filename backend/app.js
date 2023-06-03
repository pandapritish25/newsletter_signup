// jshint esversion:  6

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https'); //to send requests to internet/remote apis we need to use this https lib.


const app = express();


app.use(express.static("public")); // used to link and load the static files like styles, images , icons etc via the express server

app.use(bodyParser.urlencoded({extended:true})); // used to parse the input info received in the form of post request. 




app.get('/',(req,res)=>{
    res.sendFile(__dirname+'../frontend/signup.html');
});


app.post('/home',(req,res)=>{
    res.redirect("/");
})


app.post('/',(req,res)=>{
    const body=req.body;
    const firstName=body.fName;
    const lastName=body.lName;
    const email=body.email;
    console.log(firstName,lastName,email);

    //creating the data according to the format the mailchimp accepts, read the rules or follow angela yu
    const data={
        members:[
            {
                email_address:email,
                status:"subscribed",
                merge_fields:{
                    FNAME:firstName,
                    LNAME:lastName
                }
            }
        ]
    };


    const jsonData=JSON.stringify(data); //making the json object data to a single line using stringify

    //preparing the info according to the parameters of the below  https.request function
    const apikeyid="57aa1e231d4839860a9c68ab79559453-us21";
    const url="https://us21.api.mailchimp.com/3.0/lists/e1b516d7dc";

    const options={
        method:"POST",
        auth:"angela1:57aa1e231d4839860a9c68ab79559453-us21"
    }

    // storing the result of the below function in the request variable
    const request = https.request(url, options, (response)=>{
        if(response.statusCode === 200){
            res.sendFile(__dirname+'../frontend/success.html');
        }
        else{
            res.sendFile(__dirname+'../frontend/failure.html');
        }

        response.on("data",(data)=>{
            // console.log(JSON.parse(data));
            console.log("server is running on port 3000");
        })
    });



    request.write(jsonData); //running the jsonData on the request variable created above
    request.end(); //must end the api calls made to external apis to avoid any issues later on.
});

app.post("/failure", function(req, res){//redirects to main page
  res.redirect("/");
});
app.post("/success", function(req, res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, ()=>{ // proxess.env.PORT is useful then our app is deployed on the internet server and those servers can give random port numbers from 3000 to 5000 so using that process.env.PORT helps in that . And 5000 is used for running the server locally on our machine. If the port number 3000 is available then it will run in port 3000 else it will run on random port. that's what the line says.
    console.log("server started at port 3000 !!");
});

 //api key-57aa1e231d4839860a9c68ab79559453-us21
 //list id-e1b516d7dc
  

