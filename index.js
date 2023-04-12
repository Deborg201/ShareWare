//Variables
var tokenid;
var additems = [];

//Requires
const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const envWork = require("dotenv").config();
const path = require('path')


// database connection

const Item = require(__dirname + "/database/database.js");


app.set("view-engine", "ejs");
app.use(express.static(path.join(__dirname,"/static")));
app.use(bodyparser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

//Routes
app.get("/", function (req, res) {
    res.render("index.ejs");
})
app.get("/login", function (req, res) {
    res.render("login.ejs");
})
app.get("/profile/:z", function (req, res) {
    var profilemails = req.params.z; 
    res.render("profile.ejs", { mails: profilemails })
})
app.get("/additem/:z", function (req, res) {
    var profilemails = req.params.z; 
    res.render("addItem.ejs", { mails: profilemails });
})
app.get("/transaction/:x", async function (req, res) {
    var profilemails = req.params.x;
    var transact = [];
     const doc = await Item.find({
         "email": profilemails,
        "itemsposted": { "$elemMatch": { "$exists": true, "$nin": null } }
      })
    
    transact = doc;
    if (transact.length==0) {
        res.redirect(`/dashboard/${profilemails}`)
     } else {
        res.render("transaction.ejs", { mails: profilemails, transacts: transact });
     }
    
})
app.get("/dashboard/:y", async function (req, res) {
    var profilemails = req.params.y;
    
    const doc = await Item.find({
            "itemsposted": { "$elemMatch": { "$exists": true, "$nin": null } }
        })
    additems = doc;
    console.log(additems)
    res.render("dashboard.ejs", { mails: profilemails, items: additems});
});
app.get("/deleteacc/:del", function (req, res) {
    var profilemails = req.params.del;
    Item.deleteMany({
        "email": profilemails
    }, function (err,doc) {
        if (err === null) {
           console.log("Deleted Successfully")
       }
        
    })
    res.redirect("/login")})


app.get("/delete/:del", function (req, res) {
    profilemails = req.params.del;
    res.render("delete.ejs", { mails:profilemails})
})
// post material  

app.post("/", function (req, res) {
    if (req.body.login == 1) {
    
        function Signup_details(name, email, pass, cpass) {
            this.name = name;
            this.email = email;
            this.pass = pass;
            this.cpass = cpass;
        };
        let details = new Signup_details(req.body.signup_name, req.body.signup_email, req.body.signup_pass, req.body.signup_cpass)
        if (details.cpass == details.pass) {
            
            const profile_init = new Item({
                email: details.email,
                profile: {
                    email: details.email,
                    name: details.name,
                    pass: details.pass
                }
            });
            profile_init.save();
            console.log(profile_init.email,"added successfully to Database");
            console.log(tokenid = profile_init._id);
            res.redirect("/profile/"+profile_init.email);
        }
        else {
            console.log("Error1")
        };
    } else {
        function Details(email,pass) {
            this.email = email;
            this.pass = pass;                
        }
        const login_details = new Details(req.body.login_email, req.body.login_pass);
        Item.findOne({
            "profile.email": login_details.email,
             "profile.pass": login_details.pass
             
        }, function (err, doc) {
            if (err)
                console.log(err)
            else {
                if (doc) {
                    console.log(tokenid = doc._id);
                    var stringy = doc.email;
                    console.log(stringy);
                    res.redirect("/dashboard/"+stringy);
                    console.log("Details Matched")
                }
                else {
                    console.log("Record Not Found Try Again");
                    res.redirect("/login")
                }
                        
            }
        })
    }
    
});

app.post("/profile", function (req, res) {
    function Profile(name, surname, mobile, roll, year, room, hostel, email) {
        this.name=name;
        this.surname=surname;
        this.mobile=mobile;
        this.roll=roll;
        this.year=year;
        this.room=room;
        this.hostel= hostel;
        this.email=email;
    }
    const profile1 = new Profile(
        req.body.prof_name,
        req.body.prof_surname,
        req.body.prof_mobile,
        req.body.prof_roll,
        req.body.prof_year,
        req.body.prof_room,
        req.body.prof_hostel,
        req.body.prof_email,
    );
    console.log(profile1,tokenid);   //token id is global variable which stores db id
    Item.updateOne({
        _id:tokenid
    },{
        "name": profile1.name,
        "surname" :profile1.surname,
        "mobile" :profile1.mobile,
        "roll" :profile1.roll,
        "year" :profile1.year,
        "room" :profile1.room,
        "hostel" :profile1.hostel,
        "email": profile1.email,
        "profile.name": profile1.name,
        "profile.email": profile1.email

        
    }, function (err,doc) {
        if (err) {
            console.log("Not able to Update");
            console.log(err);

        }
        else {
            if (doc) {
                doc = profile1;
                res.redirect(`/dashboard/${doc.email}`)
                console.log(doc);
            }
        }
    })
});
app.post(`/additem`, function (req, res) {
    var message = {
        item: req.body.item,
        description: req.body.description,
        quantity: req.body.quantity
    }
    Item.updateOne({
        "profile.email": req.body.profilemail
    }, {
        $push: {
            "itemsposted": message
        }
    }, function(err, top) {
        console.log(err);
        console.log(top)
    }
    )
    res.redirect(`/dashboard/${req.body.profilemail}`)


})
app.listen(PORT, function (req, res) {
    console.log(`server running on ${PORT}`);
})
