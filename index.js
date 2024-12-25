require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8080;
const uri = process.env.MONGO_URL;
const {storage} = require("./CloudConfig")
const bodyParser = require('body-parser');
const multer  = require('multer')
const upload = multer({ storage })

//models 
const LatestUpdatemodel = require("../Backend/model/LatestUpdatemodel");
const ClubandSocietymodel = require("../Backend/model/ClubandSocietymodel");


// Parse application/json
app.use(bodyParser.json());



app.use(express.json());
app.use(cors());


// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));





//route for storing latest update in DB
app.post("/clubandsociety", upload.single('image'), (req, res) => {
  const data = req.body;
  const img = req.file.path;
  
  const newClub = new ClubandSocietymodel({
    name : data.name,
    image : img,
        description : data.description
      })
      
      res.send(" Data Added Successfully ")
      
      newClub.save()
      
      
      
    });
    
//Route for read dat from DB
app.get("/allclubs" , async(req,res)=>{
  let allclubs = await LatestUpdatemodel.find({})
  res.json(allclubs)
})




//Route for Edit 
app.post("/clubs/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params; // Extract club ID from URL
  const data = req.body; // Get updated club data

  try {
    // Find the club by ID and update with the request data
    const updatedClub = await ClubandSocietymodel.findByIdAndUpdate(
      id,
      {
        name: data.name,
        description: data.description,
        ...(req.file && {
          image: req.file.path, // File path from Multer
           
        }),
      },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedClub) {
      return res.status(404).send({ error: "Club not found" });
    }

    res.status(200).send(updatedClub); // Send the updated club as response
  } catch (error) {
    console.error("Error updating club:", error);
    res.status(500).send({ error: "Failed to update club" });
  }


  
});


app.listen(PORT,async ()=>{
    try {
        await mongoose.connect(uri);
        console.log("DB connected");
        console.log(`App is listening on Port ${PORT}`);
      } catch (error) {
        console.error("Error connecting to the database:", error);
      }
})


// Route for Delete
app.delete("/deleteclubs/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedClub = await ClubandSocietymodel.findByIdAndDelete(id);
    if (!deletedClub) {
      return res.status(404).send({ error: "Club not found" });
    }
    res.status(200).send({ message: "Club deleted successfully" });
  } catch (error) {
    console.error("Error deleting club:", error);
    res.status(500).send({ error: "Failed to delete club" });
  }
});
