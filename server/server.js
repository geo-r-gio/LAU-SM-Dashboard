
import { getDlg, getOneDlg, getAllSchools, getAllPrograms, getAllLevels, getAllLanguages, getAllCampuses, getAllAdvisors, updateTs1attendance,editSchoolCampus, assignClassPGM,updateTs2attendance,getAttendanceTs1,getAttendanceTs2,getMCdelegates,addAdv,getAdv, getOneAdv,deleteOneAdv, getFCdelegates, addDlg,getTotalStudents, updateOneDlg, deleteOneDlg,checkAdvID,checkDlgID,getAttendanceTS,getAttendanceMC,getAttendanceFC, signin, getTotal } from '../database/database.js';

import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";


const app = express();

app.listen(3000, function() {
  console.log("express is running on port 3000");

})

app.use(express.json());

app.use(cors());

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET; 
if (!SECRET_KEY) {
  console.warn("No JWT_SECRET in .env — login will fail!");
}

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    console.log("Missing username or password");
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    const user = await signin(username);

    if (!user) {
      console.log("No such user in DB");
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("Password mismatch");
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const payload = { username: user.username };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });

    return res.json({ token, user: { username: user.username } });

  } catch (err) {
    console.error("Login error caught:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// hashAllPasswordsOnce();

// async function hashAllPasswordsOnce() {
//   try {
//     const db = await mysql.createConnection({
//       host: "localhost",          // 🛠 Replace with your actual DB config
//       user: "root",               // or your MySQL user
//       password: "gpn#24#1#2003",               // or your MySQL password
//       database: "lausmdb"         // or your actual database name
//     });
//     const [rows] = await db.execute("SELECT username, password FROM login");

//     for (const row of rows) {
//       const { username, password } = row;

//       if (password.startsWith("$2b$")) {
//         console.log(`Skipping already hashed password for ${username}`);
//         continue;
//       }

//       const hashed = await bcrypt.hash(password, 10);
//       await db.execute("UPDATE login SET password = ? WHERE username = ?", [hashed, username]);
//       console.log(`Hashed password for ${username}`);
//     }

//     await db.end();
//     console.log("✅ All passwords hashed.");

//   } catch (err) {
//     console.error("Error hashing passwords:", err);
//   }
// }

// app.get("/", function(req, res){
//   res.send("express here!")
// })

app.get("/delegates", async (req,res) => {
  const delegates = await getDlg();
  res.send(delegates);
})

app.get("/delegates/:id", async (req,res) => {
  const delegate = await getOneDlg(req.params.id)
 res.send(delegate);
})

app.get("/advisors", async (req,res) => {
  const advisors = await getAdv();
  res.send(advisors);
})

app.get("/advisors/:id", async (req,res) => {
  const advisor = await getOneAdv(req.params.id)
 res.send(advisor);
})

app.put("/advisors/:id", async (req,res) => {
  const { id } = req.params;
  const { fName, lName, advNB, advEmail, advSchool, mainAdv } = req.body;

  try {
    const updatedRows = await updateOneAdv(fName, lName, advNB, advEmail, advSchool, mainAdv, id);
    res.send(updatedRows);
  } catch (error) {
    console.error('Error updating advisor:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})

app.delete("/advisors/:id", async (req,res) => {
  const { id } = req.params;

  try {
    const deletedRows = await deleteOneAdv(id);
    res.send(deletedRows);
  } catch (error) {
    console.error('Error updating advisor:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})

async function advIdGen() {
  try {
    let randVal = 0;
    let advID = 'A'
do {
  randVal = Math.round(100 + Math.random() * (999 - 100));
  advID= advID.concat(randVal.toString());
} while (await checkAdvID(advID));
  
return advID;

  } catch (error) {
    console.error('Error:', error);
  } 
}

const testing = await advIdGen();
console.log(testing);

app.post("/advisors", async (req,res) => {
  const {fName,lName,advNB,advEmail,advSchool} = req.body
  const advID = await advIdGen();
  const adv = await addAdv(advID,fName,lName,advNB,advEmail,advSchool);

  res.status(201).send(adv)
})

app.get("/schools", async (req, res) => {
  try {
    const schools = await getAllSchools();
    res.send(schools);
  } catch (error) {
    console.error("Error fetching schools:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/programs", async (req, res) => {
  try {
    const programs = await getAllPrograms();
    res.send(programs);
  } catch (error) {
    console.error("Error fetching programs:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/levels", async (req, res) => {
  try {
    const levels = await getAllLevels();
    res.send(levels);
  } catch (error) {
    console.error("Error fetching levels:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/campuses", async (req, res) => {
  try {
    const campuses = await getAllCampuses();
    res.send(campuses);
  } catch (error) {
    console.error("Error fetching campuses:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/advisorsID", async (req, res) => {
  try {
    const advisors = await getAllAdvisors();
    res.send(advisors);
  } catch (error) {
    console.error("Error fetching advisors ID:", error);
    res.status(500).send("Internal Server Error");
  }
});

async function dlgIdGen() {
  try {
    let randVal = 0;
    let dlgID = 'D'
   
do {

  randVal = Math.round(1000 + Math.random() * (9999 - 1000));
  dlgID= dlgID.concat(randVal.toString());
  console.log("sill in loop", dlgID);
} while (await checkDlgID(dlgID));
 
return dlgID;

  } catch (error) {
    console.error('Error:', error);
  } 
}


app.post("/delegates", async (req,res) => {
    const {fName,lName,dlgNB,dlgEmail,dlgSchool,dlgPGM,level,lang,dlgCampus,dlgAdv} = req.body
    // create dlgId generator 
    const dlgID = await dlgIdGen();
    const delegate = await 
    addDlg(dlgID,fName,lName,dlgNB,dlgEmail,dlgSchool,dlgPGM,level,lang,dlgCampus,dlgAdv)
    editSchoolCampus(dlgSchool,dlgCampus)
    await assignClassPGM(dlgPGM, level, lang, dlgCampus)
    res.status(201).send(delegate)
})

app.post("/advisors", async (req,res) => {
  const {fName,lName,advNB,advEmail,advSchool,mainAdv} = req.body
  // create dlgId generator 
  const advID = advIdGen();
  const advisor = await 
addAdv(advID,fName,lName,advNB,advEmail,advSchool,mainAdv)
  res.status(201).send(advisor)
})

app.put("/delegates/:id", async (req,res) => {
  const { dlgName, dlgEmail, dlgPhoneNb, dlgSchool, dlgCampus, dlgAdvisor, dlgPgm, dlgLang, pgmLevel, dlgID } = req.body;

  try {
    const updatedRows = await updateOneDlg(dlgName, dlgEmail, dlgPhoneNb, dlgSchool, dlgCampus, dlgAdvisor, dlgPgm, dlgLang, pgmLevel, dlgID);
    res.send(updatedRows);
  } catch (error) {
    console.error('Error updating delegate:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})

app.delete("/delegates/:id", async (req,res) => {
  const { id } = req.params;

  try {
    const deletedRows = await deleteOneDlg(id);
    res.send(deletedRows);
  } catch (error) {
    console.error('Error updating delegate:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})

app.get("/attendance/:classroom/delegates", async (req,res) => {
  const list = await getAttendanceTS(req.params.classroom);
  res.send(list);
})

app.get("/attendance/:classroom/:campus/delegates1", async (req,res) => {
  const list = await getAttendanceTs1(req.params.classroom, req.params.campus);
  res.send(list);
})

app.get("/attendance/:classroom/:campus/delegates2", async (req,res) => {
  const list = await getAttendanceTs2(req.params.classroom, req.params.campus);
  res.send(list);
})

app.get("/attendance/:mCommittee/delegates", async (req,res) => {
  const list = await getMCdelegates(req.params.mcCommittee, req.params.campus);
  res.send(list);
})

app.get("/attendance/:fCommittee/delegates", async (req,res) => {
  const list = await getFCdelegates(req.params.fcCommittee, req.params.campus);
  res.send(list);
})

app.put("/attendance/:fName/:classroom/:campus/delegates1", async (req,res) => {
  const list = await updateTs1attendance(req.body.attendanceTS1, req.params.fName, req.params.classroom, req.params.campus);
  res.send(list);
})

app.put("/attendance/:fName/:classroom/:campus/delegates2", async (req,res) => {
  const list = await updateTs2attendance(req.body.attendanceTS2, req.params.fName, req.params.classroom, req.params.campus);
  res.send(list);
})

// FOR TOTAL STUDENTS DASHBOARD

app.get("/dashboard/:level/:campus", async (req,res) => {
 try{ const {level,campus} = req.params
 console.log('Received parameters:', level, campus);
  const total = await getTotalStudents(level,campus);

  console.log('Total from server:', total);
  res.send(total);
} catch (error)
{
  console.error("Error in dashboard route:", error);
    res.status(500).send("Internal Server Error");
}})

// app.get("/api/delegates/program-summary", async (req, res) => {
//   try {
//     const [rows] = await getTotal();
//     res.json(rows);
//   } catch (err) {
//     console.error("Error fetching program summary:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });



