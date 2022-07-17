const mongoose = require("mongoose");

//To connect to database and avoid warnings
mongoose.connect("mongodb+srv://KhushdeepJain:FreeDatabase11@shareware.0hrscrj.mongodb.net/?retryWrites=true&w=majority",{
    useUnifiedTopology: true,
    useNewURLParser: true,
}
).then(() => {
    console.log("Connection Successful");
}).catch((err) => {
    console.log(err);
})

// Login Schema  
const profileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    pass: {
        type: String,
        required: true
    }
});

//Main Profile Schema
const itemSchema = new mongoose.Schema({
    name: String,
    surname: String,
    mobile: String,
    roll: String,
    year: String,
    hostel: String,
    room: String,
    email: String,
    profile: profileSchema,

    itemsposted: [{
        item: String,
        description: String,
        quantity : Number
    }]
})    
const Profile = mongoose.model('item',itemSchema);

module.exports = mongoose.model('item', itemSchema);
