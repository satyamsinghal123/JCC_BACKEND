require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 8080;
const uri = process.env.MONGO_URL;
const { storage } = require("./CloudConfig");
const bodyParser = require("body-parser");
const multer = require("multer");
const upload = multer({ storage });

//models
const Happeningmodel = require("./model/Happeningmodel");
const Noticemodel = require("./model/Noticemodel");
const Thoughtmodel = require("./model/Thoughtmodel");
const Acheivementmodel = require("./model/Acheivementmodel");
const RoughAcheivementmodel = require("./model/RoughAcheivement");
const StudentCornermodel = require("./model/StudentCornermodel");
const Usermodel = require("./model/Usermodel");
const UserActivitymodel = require("./model/UserActivitymodel")
// Parse application/json
app.use(bodyParser.json());

app.use(express.json());
app.use(cors());

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));
const bcrypt = require("bcrypt");

app.get("/", (req, res) => {
  res.send("Working Superb");
});

app.post("/auth", async (req, res) => {
  const { username, password } = req.body
  const pass = password

  try {
    const user = await Usermodel.findOne({ name: username, password: pass })

    if (user) {
      // Log user activity
      const activity = new UserActivitymodel({
        userId: user._id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        loginTime: new Date(),
      })
      await activity.save()

      // Limit to 30 most recent activities
      const activityCount = await UserActivitymodel.countDocuments()
      if (activityCount > 30) {
        const oldestActivity = await UserActivitymodel.findOne().sort({ loginTime: 1 })
        await UserActivitymodel.findByIdAndDelete(oldestActivity._id)
      }

      res.json({ success: true, userId: user._id })
    } else {
      res.json({ success: false })
    }
  } catch (error) {
    console.error("Authentication error:", error)
    res.status(500).json({ success: false, error: "Internal server error" })
  }
})

// Get user activities
app.get("/user-activities", async (req, res) => {
  try {
    const activities = await UserActivitymodel.find().sort({ loginTime: -1 }).limit(30)
    res.json(activities)
  } catch (error) {
    console.error("Error fetching user activities:", error)
    res.status(500).json({ error: "Failed to fetch user activities" })
  }
})

//              User

app.post("/user", upload.single("image"), async (req, res) => {
  const data = req.body;
  const img = req.file ? req.file.path : null;

  const newUser = new Usermodel({
    name: data.name,
    password: data.password,
    phoneNumber: data.phoneNumber,
    image: img,
    address: data.address,
  });

  try {
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

app.get("/allusers", async (req, res) => {
  try {
    const allUsers = await Usermodel.find({}, { password: 0 });
    res.json(allUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.get("/user/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await Usermodel.findById(id, { password: 0 });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

app.put("/user/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const img = req.file ? req.file.path : undefined;

  try {
    const updateData = {
      name: data.name,
      phoneNumber: data.phoneNumber,
      address: data.address,
    };

    if (img) {
      updateData.image = img;
    }

    const updatedUser = await Usermodel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

app.delete("/deleteuser/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await Usermodel.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

//      Notice
// Create a new notice
app.post("/notice", async (req, res) => {
  const data = req.body;

  const newNotice = new Noticemodel({
    type: data.type,
    message: data.message,
  });

  try {
    await newNotice.save();
    res.send("Notice Added Successfully");
  } catch (error) {
    console.error("Error creating notice:", error);
    res.status(500).send({ error: "Failed to create notice" });
  }
});

// Get all notices
app.get("/allnotices", async (req, res) => {
  try {
    const allnotices = await Noticemodel.find({});
    res.json(allnotices);
  } catch (error) {
    console.error("Error fetching notices:", error);
    res.status(500).send({ error: "Failed to fetch notices" });
  }
});

// Edit a notice
app.post("/noticeEdit/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const notice = await Noticemodel.findById(id);
    if (!notice) {
      return res.status(404).send({ error: "Notice not found" });
    }
    res.json(notice);
  } catch (error) {
    console.error("Error fetching notice:", error);
    res.status(500).send({ error: "Failed to fetch notice" });
  }
});

app.post("/notice/:id", async (req, res) => {
  const { id } = req.params;
  const { type, message } = req.body;

  try {
    const updatedNotice = await Noticemodel.findByIdAndUpdate(
      id,
      { type, message },
      { new: true, runValidators: true }
    );

    if (!updatedNotice) {
      return res.status(404).send({ error: "Notice not found" });
    }

    res.send("EDITED");
  } catch (error) {
    console.error("Error updating Notice:", error);
    res.status(500).send({ error: "Failed to update Notice" });
  }
});

// Delete a notice
app.delete("/deletenotice/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedNotice = await Noticemodel.findByIdAndDelete(id);
    if (!deletedNotice) {
      return res.status(404).send({ error: "Notice not found" });
    }
    res.status(200).send({ message: "Notice deleted successfully" });
  } catch (error) {
    console.error("Error deleting notice:", error);
    res.status(500).send({ error: "Failed to delete notice" });
  }
});

// Trigger notification
app.post("/trigger-notification", (req, res) => {
  // This route doesn't need to do anything on the server
  // It's just a trigger for the client-side notification
  res.status(200).send({ message: "Notification triggered" });
});

//      Thought

// Create or update thought
app.post("/thought", async (req, res) => {
  const { thought } = req.body;

  try {
    const existingThought = await Thoughtmodel.findOne();
    if (existingThought) {
      existingThought.thought = thought;
      existingThought.date = new Date();
      await existingThought.save();
      res.send("Thought Updated Successfully");
    } else {
      const newThought = new Thoughtmodel({
        thought: thought,
        date: new Date(),
      });
      await newThought.save();
      res.send("Thought Added Successfully");
    }
  } catch (error) {
    console.error("Error creating/updating thought:", error);
    res.status(500).send({ error: "Failed to create/update thought" });
  }
});

// Get thought
app.get("/thought", async (req, res) => {
  try {
    const thought = await Thoughtmodel.findOne();
    res.json(thought);
  } catch (error) {
    console.error("Error fetching thought:", error);
    res.status(500).send({ error: "Failed to fetch thought" });
  }
});

// Update thought
app.put("/thought", async (req, res) => {
  const { thought } = req.body;

  try {
    const updatedThought = await Thoughtmodel.findOneAndUpdate(
      {},
      { thought: thought, date: new Date() },
      { new: true, upsert: true }
    );

    if (!updatedThought) {
      return res.status(404).send({ error: "Thought not found" });
    }

    res.send("Thought Updated Successfully");
  } catch (error) {
    console.error("Error updating Thought:", error);
    res.status(500).send({ error: "Failed to update Thought" });
  }
});

// Delete thought
app.delete("/deletethought/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedThought = await Thoughtmodel.findByIdAndDelete(id);
    if (!deletedThought) {
      return res.status(404).send({ error: "Thought not found" });
    }
    res.status(200).send({ message: "Thought deleted successfully" });
  } catch (error) {
    console.error("Error deleting thought:", error);
    res.status(500).send({ error: "Failed to delete thought" });
  }
});

//      Acheievement

// Create a new achievement
app.post("/achievement", upload.single("img"), async (req, res) => {
  const data = req.body;
  const img = req.file ? req.file.path : null;

  const newAchievement = new Acheivementmodel({
    name: data.name,
    dept: data.dept,
    Course: data.Course,
    img: img,
    sem: data.sem,
    desc: data.desc,
  });

  try {
    // Count the number of existing achievements
    const count = await Acheivementmodel.countDocuments();

    if (count >= 50) {
      // If there are already 50 achievements, find the oldest one and delete it
      const oldestAchievement = await Acheivementmodel.findOne().sort({
        _id: 1,
      });
      await Acheivementmodel.findByIdAndDelete(oldestAchievement._id);
    }

    // Save the new achievement
    await newAchievement.save();
    res.send("Achievement Added Successfully");
  } catch (error) {
    console.error("Error creating achievement:", error);
    res.status(500).send({ error: "Failed to create achievement" });
  }
});

// Get all achievements
app.get("/allachievements", async (req, res) => {
  try {
    const allAchievements = await Acheivementmodel.find({});
    res.json(allAchievements);
  } catch (error) {
    console.error("Error fetching achievements:", error);
    res.status(500).send({ error: "Failed to fetch achievements" });
  }
});

// Edit an achievement
app.get("/achievementEdit/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const achievement = await Acheivementmodel.findById(id);
    if (!achievement) {
      return res.status(404).send({ error: "Achievement not found" });
    }
    res.json(achievement);
  } catch (error) {
    console.error("Error fetching achievement:", error);
    res.status(500).send({ error: "Failed to fetch achievement" });
  }
});

app.put("/achievement/:id", upload.single("img"), async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const img = req.file ? req.file.path : undefined;

  try {
    const updatedAchievement = await Acheivementmodel.findByIdAndUpdate(
      id,
      {
        name: data.name,
        dept: data.dept,
        Course: data.Course,
        ...(img && { img: img }),
        sem: data.sem,
        desc: data.desc,
      },
      { new: true, runValidators: true }
    );

    if (!updatedAchievement) {
      return res.status(404).send({ error: "Achievement not found" });
    }

    res.send("Achievement Updated Successfully");
  } catch (error) {
    console.error("Error updating Achievement:", error);
    res.status(500).send({ error: "Failed to update Achievement" });
  }
});

// Delete an achievement
app.delete("/deleteachievement/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedAchievement = await Acheivementmodel.findByIdAndDelete(id);
    if (!deletedAchievement) {
      return res.status(404).send({ error: "Achievement not found" });
    }
    res.status(200).send({ message: "Achievement deleted successfully" });
  } catch (error) {
    console.error("Error deleting achievement:", error);
    res.status(500).send({ error: "Failed to delete achievement" });
  }
});

//          Happening

app.post("/happening", upload.single("image"), async (req, res) => {
  const data = req.body;
  const img = req.file ? req.file.path : null;

  const newHappening = new Happeningmodel({
    type: data.type,
    date: new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
    }),
    image: img,
    link: data.link || "https://example.com/exam.pdf",
  });

  try {
    await newHappening.save();
    res.send("Happening Added Successfully");
  } catch (error) {
    console.error("Error creating happening:", error);
    res.status(500).send({ error: "Failed to create happening" });
  }
});

app.get("/allhappening", async (req, res) => {
  try {
    const allHappenings = await Happeningmodel.find({});
    res.json(allHappenings);
  } catch (error) {
    console.error("Error fetching happenings:", error);
    res.status(500).send({ error: "Failed to fetch happenings" });
  }
});

app.put("/happening/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const img = req.file ? req.file.path : undefined;

  try {
    const updatedHappening = await Happeningmodel.findByIdAndUpdate(
      id,
      {
        type: data.type,
        link: data.link || "https://example.com/exam.pdf",
        ...(img && { image: img }),
      },
      { new: true, runValidators: true }
    );

    if (!updatedHappening) {
      return res.status(404).send({ error: "Happening not found" });
    }

    res.send("Happening Updated Successfully");
  } catch (error) {
    console.error("Error updating Happening:", error);
    res.status(500).send({ error: "Failed to update Happening" });
  }
});

app.get("/happeningEdit/:id", async (req, res) => {
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

app.delete("/deletehappening/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedHappening = await Happeningmodel.findByIdAndDelete(id);
    if (!deletedHappening) {
      return res.status(404).send({ error: "Happening not found" });
    }
    res.status(200).send({ message: "Happening deleted successfully" });
  } catch (error) {
    console.error("Error deleting happening:", error);
    res.status(500).send({ error: "Failed to delete happening" });
  }
});

// Student Corner

// Create a new student corner
app.post("/studentcorner", upload.single("pdf"), async (req, res) => {
  const data = req.body;
  const file = req.file;

  const newStudentCorner = new StudentCornermodel({
    type: data.type,
    course: data.course,
    semester: data.semester,
    title: data.title,
    date: new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
    link: file ? file.path : "https://example.com/exam.pdf",
  });

  try {
    await newStudentCorner.save();
    res.send("Student Corner Added Successfully");
  } catch (error) {
    console.error("Error creating student corner:", error);
    res.status(500).send({ error: "Failed to create student corner" });
  }
});

// Get all student corners
app.get("/allstudentcorners", async (req, res) => {
  try {
    const allStudentCorners = await StudentCornermodel.find({});
    res.json(allStudentCorners);
  } catch (error) {
    console.error("Error fetching student corners:", error);
    res.status(500).send({ error: "Failed to fetch student corners" });
  }
});

// Edit a student corner
app.get("/studentcornerEdit/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const studentCorner = await StudentCornermodel.findById(id);
    if (!studentCorner) {
      return res.status(404).send({ error: "Student Corner not found" });
    }
    res.json(studentCorner);
  } catch (error) {
    console.error("Error fetching student corner:", error);
    res.status(500).send({ error: "Failed to fetch student corner" });
  }
});

app.put("/studentcorner/:id", upload.single("link"), async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const file = req.file;

  try {
    const updatedStudentCorner = await StudentCornermodel.findByIdAndUpdate(
      id,
      {
        type: data.type,
        course: data.course,
        semester: data.semester,
        title: data.title,
        ...(file && { link: file.path }),
      },
      { new: true, runValidators: true }
    );

    if (!updatedStudentCorner) {
      return res.status(404).send({ error: "Student Corner not found" });
    }

    res.send("Student Corner Updated Successfully");
  } catch (error) {
    console.error("Error updating Student Corner:", error);
    res.status(500).send({ error: "Failed to update Student Corner" });
  }
});

// Delete a student corner
app.delete("/deletestudentcorner/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedStudentCorner = await StudentCornermodel.findByIdAndDelete(id);
    if (!deletedStudentCorner) {
      return res.status(404).send({ error: "Student Corner not found" });
    }
    res.status(200).send({ message: "Student Corner deleted successfully" });
  } catch (error) {
    console.error("Error deleting student corner:", error);
    res.status(500).send({ error: "Failed to delete student corner" });
  }
});

// RoughAchievement routes

// Create a new rough achievement
app.post("/roughachievement", upload.single("img"), async (req, res) => {
  const data = req.body;
  const img = req.file ? req.file.path : null;

  const newRoughAchievement = new RoughAcheivementmodel({
    name: data.name,
    dept: data.dept,
    Course: data.Course,
    img: img,
    sem: data.sem,
    desc: data.desc,
    type: data.type,
  });

  try {
    await newRoughAchievement.save();
    res.send("Rough Achievement Added Successfully");
  } catch (error) {
    console.error("Error creating rough achievement:", error);
    res.status(500).send({ error: "Failed to create rough achievement" });
  }
});

// Get all rough achievements
app.get("/allroughachievements", async (req, res) => {
  try {
    const allRoughAchievements = await RoughAcheivementmodel.find({});
    res.json(allRoughAchievements);
  } catch (error) {
    console.error("Error fetching rough achievements:", error);
    res.status(500).send({ error: "Failed to fetch rough achievements" });
  }
});

// Get a single rough achievement
app.get("/roughachievement/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const roughAchievement = await RoughAcheivementmodel.findById(id);
    if (!roughAchievement) {
      return res.status(404).send({ error: "Rough Achievement not found" });
    }
    res.json(roughAchievement);
  } catch (error) {
    console.error("Error fetching rough achievement:", error);
    res.status(500).send({ error: "Failed to fetch rough achievement" });
  }
});

// Delete a rough achievement
app.delete("/deleteroughachievement/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedRoughAchievement =
      await RoughAcheivementmodel.findByIdAndDelete(id);
    if (!deletedRoughAchievement) {
      return res.status(404).send({ error: "Rough Achievement not found" });
    }
    res.status(200).send({ message: "Rough Achievement deleted successfully" });
  } catch (error) {
    console.error("Error deleting rough achievement:", error);
    res.status(500).send({ error: "Failed to delete rough achievement" });
  }
});

// Achieve a rough achievement
app.post("/achieveroughachievement/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const roughAchievement = await RoughAcheivementmodel.findById(id);
    if (!roughAchievement) {
      return res.status(404).send({ error: "Rough Achievement not found" });
    }

    const newAchievement = new Acheivementmodel({
      name: roughAchievement.name,
      dept: roughAchievement.dept,
      Course: roughAchievement.Course,
      img: roughAchievement.img,
      sem: roughAchievement.sem,
      desc: roughAchievement.desc,
      type: roughAchievement.type,
    });

    await newAchievement.save();
    await RoughAcheivementmodel.findByIdAndDelete(id);

    res
      .status(200)
      .send({
        message:
          "Rough Achievement successfully achieved and moved to Achievements",
      });
  } catch (error) {
    console.error("Error achieving rough achievement:", error);
    res.status(500).send({ error: "Failed to achieve rough achievement" });
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
