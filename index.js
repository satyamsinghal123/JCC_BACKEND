require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 8080; // Changed from 8080 to 3000
const uri = process.env.MONGO_URL;
const { storage } = require("./CloudConfig");
const bodyParser = require("body-parser");
const multer = require("multer");
const upload = multer({ storage });

//models
const EvenSemmodel = require("./model/AllEvenSemmodel")
const Happeningmodel = require("./model/Happeningmodel");
const ClubandSocietymodel = require("./model/ClubandSocietymodel");
const Announcementmodel = require("./model/Announcementmodel")
const Homemodel = require("./model/Homemodel");


// Parse application/json
app.use(bodyParser.json());

app.use(express.json());
app.use(cors());

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Working well");
});

//route for storing latest update in DB
app.post("/clubandsociety", upload.single("image"), (req, res) => {
  const data = req.body;
  const img = req.file.path;

  const newClub = new ClubandSocietymodel({
    name: data.name,
    image: img,
    description: data.description,
  });

  res.send(" Data Added Successfully ");

  newClub.save();
});

app.post("/happening", upload.single("image"), (req, res) => {
  const data = req.body;
  const img = req.file.path;

  const happening = new Happeningmodel({
    title: data.title,
    image: img,
    depart: data.depart,
    start: data.start,
    lastApply: data.lastApply
  });

  res.send(" Data Added Successfully ");

  happening.save();
});

app.post("/announcement", async (req, res) => {
  const data = req.body;

  const newAnnouncement = new Announcementmodel({
    category: data.category,
    text: data.text,
  });

  try {
    await newAnnouncement.save();
    res.send("Data Added Successfully");
  } catch (error) {
    console.error("Error creating announcement:", error);
    res.status(500).send({ error: "Failed to create announcement" });
  }
});


app.post("/evensem", async (req, res) => {
  const data = req.body;

  const newevensem = new EvenSemmodel({
    date : data.date,
    title : data.title,
    subtitle : data.subtitle,
    type : data.type
  });

  try {
    await newevensem.save();
    res.send("Data Added Successfully");
  } catch (error) {
    console.error("Error creating EvenSem:", error);
    res.status(500).send({ error: "Failed to create announcement" });
  }
});






//Route for read data from DB

app.get("/allclubs", async (req, res) => {
  try {
    let allclubs = await ClubandSocietymodel.find({});
    res.json(allclubs);
  } catch (error) {
    console.error("Error fetching clubs:", error);
    res.status(500).send({ error: "Failed to fetch clubs" });
  }
});


app.get("/allhappening", async (req, res) => {
  try {
    let allhappening = await Happeningmodel.find({});
    res.json(allhappening);
  } catch (error) {
    console.error("Error fetching clubs:", error);
    res.status(500).send({ error: "Failed to fetch clubs" });
  }
});




app.get("/allannouncement", async (req, res) => {
  try {
    let allannouncement = await Announcementmodel.find({});
    res.json(allannouncement);
  } catch (error) {
    console.error("Error fetching clubs:", error);
    res.status(500).send({ error: "Failed to fetch clubs" });
  }
});



app.get("/allevensem", async (req, res) => {
  try {
    let allevensem = await EvenSemmodel.find({});
    res.json(allevensem);
  } catch (error) {
    console.error("Error fetching clubs:", error);
    res.status(500).send({ error: "Failed to fetch clubs" });
  }
});



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

    // Redirect to the desired URL after successful update
    res.send("Edited");
  } catch (error) {
    console.error("Error updating club:", error);
    res.status(500).send({ error: "Failed to update club" });
  }
});



app.post("/happening/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params; // Extract club ID from URL
  const data = req.body; // Get updated club data

  console.log(data)

  try {
    // Find the club by ID and update with the request data
    const updatedHappening = await Happeningmodel.findByIdAndUpdate(
      id,
      {
        title: data.title,
        ...(req.file && {
          image: req.file.path, // File path from Multer
        }),
        depart: data.depart,
        start: data.start,
        lastApply: data.lastApply


      },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedHappening) {
      return res.status(404).send({ error: "Club not found" });
    }

    res.send("EDITED")// Send the updated club as response
  } catch (error) {
    console.error("Error updating club:", error);
    res.status(500).send({ error: "Failed to update club" });
  }
});


app.post("/happeningEdit/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const happening = await Happeningmodel.findById(id);
    if (!happening) {
      return res.status(404).send({ error: "Happening not found" });
    }
    res.json(happening);
  } catch (error) {
    console.error("Error fetching happening:", error);
    res.status(500).send({ error: "Failed to fetch happening" });
  }
});




app.post("/announcementEdit/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const announcement = await Announcementmodel.findById(id);
    if (!announcement) {
      return res.status(404).send({ error: "Happening not found" });
    }
    res.json(announcement);
  } catch (error) {
    console.error("Error fetching happening:", error);
    res.status(500).send({ error: "Failed to fetch happening" });
  }
});


app.post("/announcement/:id",  async (req, res) => {
  const { id } = req.params;
  const { category, text } = req.body; // Extract data from FormData

  console.log(req.body);

  try {
    const updatedAnnouncement = await Announcementmodel.findByIdAndUpdate(
      id,
      { category, text },
      { new: true, runValidators: true }
    );

    if (!updatedAnnouncement) {
      return res.status(404).send({ error: "Announcement not found" });
    }

    res.send("EDITED");
  } catch (error) {
    console.error("Error updating Announcement:", error);
    res.status(500).send({ error: "Failed to update Announcement" });
  }
});

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



app.delete("/deletehappening/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedHappening = await Happeningmodel.findByIdAndDelete(id);
    if (!deletedHappening) {
      return res.status(404).send({ error: "Club not found" });
    }
    res.status(200).send({ message: "Club deleted successfully" });
  } catch (error) {
    console.error("Error deleting club:", error);
    res.status(500).send({ error: "Failed to delete club" });
  }
});


app.delete("/deleteannouncement/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedannouncement = await Announcementmodel.findByIdAndDelete(id);
    if (!deletedannouncement) {
      return res.status(404).send({ error: "Club not found" });
    }
    res.status(200).send({ message: "Club deleted successfully" });
  } catch (error) {
    console.error("Error deleting club:", error);
    res.status(500).send({ error: "Failed to delete club" });
  }
});

// EvenSem Edit endpoint
app.post("/evensemEdit/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const evensem = await EvenSemmodel.findById(id);
    if (!evensem) {
      return res.status(404).send({ error: "Even Semester entry not found" });
    }
    res.json(evensem);
  } catch (error) {
    console.error("Error fetching even semester entry:", error);
    res.status(500).send({ error: "Failed to fetch even semester entry" });
  }
});

// EvenSem Update endpoint
app.post("/evensem/:id", async (req, res) => {
  const { id } = req.params;
  const { date, title, subtitle, type } = req.body;

  try {
    const updatedEvenSem = await EvenSemmodel.findByIdAndUpdate(
      id,
      { date, title, subtitle, type },
      { new: true, runValidators: true }
    );

    if (!updatedEvenSem) {
      return res.status(404).send({ error: "Even Semester entry not found" });
    }

    res.send("EDITED");
  } catch (error) {
    console.error("Error updating Even Semester entry:", error);
    res.status(500).send({ error: "Failed to update Even Semester entry" });
  }
});

// EvenSem Delete endpoint
app.delete("/deleteevensem/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedEvenSem = await EvenSemmodel.findByIdAndDelete(id);
    if (!deletedEvenSem) {
      return res.status(404).send({ error: "Even Semester entry not found" });
    }
    res.status(200).send({ message: "Even Semester entry deleted successfully" });
  } catch (error) {
    console.error("Error deleting even semester entry:", error);
    res.status(500).send({ error: "Failed to delete even semester entry" });
  }
});

// Route for creating home data
app.post("/home", upload.fields([
  { name: 'Homebanner', maxCount: 1 },
  { name: 'bulletinData[0][image]', maxCount: 1 },
  { name: 'bulletinData[1][image]', maxCount: 1 },
  { name: 'bulletinData[2][image]', maxCount: 1 },
  { name: 'bulletinData[3][image]', maxCount: 1 },
  { name: 'bulletinData[4][image]', maxCount: 1 }
]), async (req, res) => {
  try {
    const data = req.body;
    const files = req.files;

    // Parse bulletinData if it's a string
    let bulletinData = [];
    if (typeof data.bulletinData === 'string') {
      bulletinData = JSON.parse(data.bulletinData);
    } else if (Array.isArray(data.bulletinData)) {
      bulletinData = data.bulletinData;
    }

    // Map through bulletin data and add image paths
    bulletinData = bulletinData.map((bulletin, index) => {
      const imageField = `bulletinData[${index}][image]`;
      return {
        ...bulletin,
        image: files[imageField] ? files[imageField][0].path : bulletin.image
      };
    });

    const home = new Homemodel({
      Homebanner: files.Homebanner ? files.Homebanner[0].path : null,
      bulletinData: bulletinData
    });

    await home.save();
    res.status(200).send("Home Data Added Successfully");
  } catch (error) {
    console.error("Error creating home data:", error);
    res.status(500).send({ error: "Failed to create home data", details: error.message });
  }
});

app.post("/home/:id", upload.fields([
  { name: 'Homebanner', maxCount: 1 },
  { name: 'bulletinData[0][image]', maxCount: 1 },
  { name: 'bulletinData[1][image]', maxCount: 1 },
  { name: 'bulletinData[2][image]', maxCount: 1 },
  { name: 'bulletinData[3][image]', maxCount: 1 },
  { name: 'bulletinData[4][image]', maxCount: 1 }
]), async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const files = req.files;

  try {
    let updateData = {};

    if (files.Homebanner) {
      updateData.Homebanner = files.Homebanner[0].path;
    }

    if (data.bulletinData) {
      let bulletinData = JSON.parse(data.bulletinData);
      bulletinData = bulletinData.map((bulletin, index) => {
        if (files[`bulletinData[${index}][image]`]) {
          bulletin.image = files[`bulletinData[${index}][image]`][0].path;
        }
        return bulletin;
      });
      updateData.bulletinData = bulletinData;
    }

    const updatedHome = await Homemodel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedHome) {
      return res.status(404).json({ error: "Home not found" });
    }

    res.status(200).json({ message: "Home Updated Successfully", data: updatedHome });
  } catch (error) {
    console.error("Error updating Home:", error);
    res.status(500).json({ error: "Failed to update Home", details: error.message });
  }
});



app.get("/allhome", async (req, res) => {
  try {
    let allhomes = await Homemodel.find({});
    res.json(allhomes);
  } catch (error) {
    console.error("Error fetching homes:", error);
    res.status(500).send({ error: "Failed to fetch homes" });
  }
});

app.delete("/deletehome/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedHome = await Homemodel.findByIdAndDelete(id);
    if (!deletedHome) {
      return res.status(404).send({ error: "Home not found" });
    }
    res.status(200).send({ message: "Home deleted successfully" });
  } catch (error) {
    console.error("Error deleting home:", error);
    res.status(500).send({ error: "Failed to delete home" });
  }
});


app.listen(PORT, async () => {
  try {
    await mongoose.connect(uri);
    console.log("DB connected");
    console.log(`App is listening on Port ${PORT}`);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
});

