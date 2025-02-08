
import { getDlg, getOneDlg,updateTs1attendance,editSchoolCampus, assignClassPGM,updateTs2attendance,getBeirutTs1,getBeirutTs2,getMCdelegates,addAdv,getAdv, getOneAdv,deleteOneAdv, getFCdelegates, addDlg,getTotalStudents, updateOneDlg, deleteOneDlg,checkAdvID,checkDlgID,getAttendanceTS,getAttendanceMC,getAttendanceFC, signin } from '../database/database.js';

import express from "express";
import cors from "cors";

// const express = require('express');
// const cors = require('cors');

const app = express();
//require("dotenv").config();

app.listen(3000, function() {
  console.log("express is running on port 3000");

})

app.use(express.json());

app.use(cors());

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await signin(username, password)
  res.send(user)
})


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
  //const { dlgID } = req.body;

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
  // create dlgId generator 
  const advID = await advIdGen();
//  const mainAdv = await getMainAdv(advSchool);
  const adv = await addAdv(advID,fName,lName,advNB,advEmail,advSchool);

  res.status(201).send(adv)
})


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








// WHAT  GIO   DID


app.put("/delegates/:id", async (req,res) => {
  //const { id } = req.params;
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
  //const { dlgID } = req.body;

  try {
    const deletedRows = await deleteOneDlg(id);
    res.send(deletedRows);
  } catch (error) {
    console.error('Error updating delegate:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})
































// const fs = require('fs');



// fs.readFile('../client/src/data/dlgData.json', 'utf8', function(err,data){
// if(err){
//   console.error(err);
//   return;

// }
 
//  try {
//   const delegate = JSON.parse(data);
//   console.log(delegate);
//  } catch (error){
//   console.error('ERROR', error);

//  }
// })

//import { readFileSync, writeFile } from 'fs';

//const delegate = readFileSync('../client/src/data/dlgData.json','utf-8');


//console.log(JSON.parse(delegate));


// const saveData = (data,file) => {
//   const finished = (error) => {
//       if (error){
//           console.error(error)
//           return;
//       }

//   }

 
//   writeFile(file,JSON.stringify(data,null,2), finished)

// }
 
//saveData(JSON.parse(delegate), 'newdlgData.json');






app.get("/attendance/:classroom/delegates", async (req,res) => {
  const list = await getAttendanceTS(req.params.classroom);
  res.send(list);
})

app.get("/beiruttxt", async (req,res) => {
  const list = await getBeirutTs1();
  res.send(list);
})


app.get("/BEIRUTTS1/delegates", async (req,res) => {
  const list = await getAttendanceTS(req.params.classroom);
  res.send(list);
})


// // gio's: worked
// app.get("/beiruttxt/:classroom/delegates1", async (req,res) => {
//   const list = await getBeirutTs1(req.params.classroom);
//   res.send(list);
// })
// //for TS2 
// app.get("/beiruttxt/:classroom/delegates2", async (req,res) => {
//   const list = await getBeirutTs2(req.params.classroom);
//   res.send(list);
// })

// //for mock
// app.get("/beiruttxt/:mCommittee/delegates", async (req,res) => {
//   const list = await getMCdelegates(req.params.mcCommittee);
//   res.send(list);
// })


// //for fc
// app.get("/beiruttxt/:fCommittee/delegates", async (req,res) => {
//   const list = await getFCdelegates(req.params.fcCommittee);
//   res.send(list);
// })
// app.get("/delegates/:id", async (req,res) => {
//   const delegate = await getOneDlg(req.params.id)
//  res.send(delegate);
// })

 
// app.get("/attendance/:committee/MCrepresentatives", async (req,res) => {
//   const list = await getAttendanceMC(req.params.committee);
//   res.send(list);
// })


   
// app.get("/attendance/:committee/FCrepresentatives", async (req,res) => {
//   const list = await getAttendanceFC(req.params.committee);
//   res.send(list);
// })
   
app.get("/attendance/:classroom/delegates", async (req,res) => {
  const list = await getAttendanceTS(req.params.classroom);
  res.send(list);
})

app.get("/beiruttxt/:classroom/:campus/delegates1", async (req,res) => {
  const list = await getBeirutTs1(req.params.classroom, req.params.campus);
  res.send(list);
})

app.get("/beiruttxt/:classroom/:campus/delegates2", async (req,res) => {
  const list = await getBeirutTs2(req.params.classroom, req.params.campus);
  res.send(list);
})

app.get("/beiruttxt/:mCommittee/delegates", async (req,res) => {
  const list = await getMCdelegates(req.params.mcCommittee, req.params.campus);
  res.send(list);
})

app.get("/beiruttxt/:fCommittee/delegates", async (req,res) => {
  const list = await getFCdelegates(req.params.fcCommittee, req.params.campus);
  res.send(list);
})

app.put("/beiruttxt/:fName/:classroom/:campus/delegates1", async (req,res) => {
  const list = await updateTs1attendance(req.body.attendanceTS1, req.params.fName, req.params.classroom, req.params.campus);
  res.send(list);
})

app.put("/beiruttxt/:fName/:classroom/:campus/delegates2", async (req,res) => {
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



