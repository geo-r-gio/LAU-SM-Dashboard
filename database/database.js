import mysql from 'mysql2'
import fs from 'fs/promises'
import dotenv from 'dotenv'
dotenv.config()


export const pool = mysql.createPool({
host: process.env.MYSQL_HOST,
user: 'root', //process.env.MYSQL_USER
password: 'gpn#24#1#2003',  //process.env.MYSQL_PASSWORD
database: process.env.MYSQL_DATABASE
}).promise();


export async function getCapacityForDashboard(campus,pgm,level){
  await pool.query('USE LAUSMDB');
  const [capacity] = await pool.query(`SELECT * FROM TSCLASS WHERE pgm='${pgm}' AND level='${level}' AND campus='${campus}'`);
  const cap = capacity[0].capacity;
return cap;
}

export async function getremainingForDashboard(campus,pgm,level){
  const [cap]= await getCapacityForDashboard(campus,pgm,level);
const [query] = await pool.query(`SELECT COUNT(*) FROM DELEGATE WHERE pgm='${pgm}' AND level='${level}' AND campus='${campus}' AND TSCLASS IS NOT NULL`);
return (cap[0].capacity) - (query[0].capacity);
}

//array of js objects
export async function getDlg(){
  await pool.query('USE LAUSMDB');
  const [rows] = await pool.query('SELECT * FROM delegate');
  return rows;
}

// Save data to a JSON file
async function saveDataToFile() {
  try {
    const data = await getDlg();

    // Format the data as JSON
    const jsonData = JSON.stringify(data, null, 2);

    // Write JSON data to a file
    await fs.writeFile('newdlgData.json', jsonData, 'utf8');
  } catch (error) {
    console.error('Error:', error);
  } 
}

export async function signin(username) {
  await pool.query("USE lausmdb");

  // Query by username *only*
  const [rows] = await pool.query(
    "SELECT * FROM login WHERE username = ?",
    [username]
  );

  console.log("signin() DB returned rows:", rows);
  return rows[0] || null;                                 // either a row or null
}


export async function getOneDlg(id){
  await pool.query('USE LAUSMDB');
  const [rows] = await pool.query('SELECT * FROM delegate WHERE dlgID = ?',
   [id]);
  return rows; // get the object in the array
}

// update/edit delegate
export async function updateOneDlg(dlgID,fName,lName,dlgNB,dlgEmail,dlgSchool,dlgPGM,level,lang,dlgCampus,dlgAdv){
  await pool.query('USE LAUSMDB')
  const result = await pool.query(
    'UPDATE delegate SET dlgID=?,fName=?,lName=?,dlgNB=?,dlgEmail=?,dlgSchool=?,dlgPGM=?,level=?,lang=?,dlgCampus=?,dlgAdv=?'
    , [dlgID,fName,lName,dlgNB,dlgEmail,dlgSchool,dlgPGM,level,lang,dlgCampus,dlgAdv]);
  const dID = result.insertId
  return getOneDlg(dID);
}

export async function deleteOneDlg(id){
  await pool.query('USE LAUSMDB')
  const result = await pool.query(
    'DELETE FROM delegate WHERE dlgID = ?', [id]);
  const deletionSuccessful = result.affectedRows > 0;
  return deletionSuccessful;
}

export async function getAllSchools() {
  await pool.query('USE LAUSMDB');
  const [rows] = await pool.query('SELECT schoolName FROM SCHOOL');
  return rows;
}

export async function getAllPrograms() {
  await pool.query('USE LAUSMDB');
  const [rows] = await pool.query('SELECT DISTINCT dlgPGM FROM DELEGATE');
  return rows;
}

export async function getAllLevels() {
  await pool.query('USE LAUSMDB');
  const [rows] = await pool.query('SELECT DISTINCT level FROM DELEGATE');
  return rows;
}

export async function getAllLanguages() {
  await pool.query('USE LAUSMDB');
  const [rows] = await pool.query('SELECT DISTINCT lang FROM DELEGATE');
  return rows;
}

export async function getAllCampuses() {
  await pool.query('USE LAUSMDB');
  const [rows] = await pool.query('SELECT DISTINCT dlgCampus FROM DELEGATE');
  return rows;
}

export async function getAllAdvisors() {
  await pool.query('USE LAUSMDB');
  const [rows] = await pool.query('SELECT DISTINCT advID FROM ADVISOR');
  return rows;
}

export async function updateOneAdv(fName,lName,advNB,advEmail,advSchool,mainAdv,advID){
  await pool.query('USE LAUSMDB')
  const result = await pool.query(
    'UPDATE advisor SET fName=?,lName=?,advNB=?,advEmail=?,advSchool=?,mainAdv=? WHERE advID=?'
    , [fName,lName,advNB,advEmail,advSchool,mainAdv,advID]);
  const dID = result.insertId
  return getOneAdv(dID);
}

export async function updateTs1attendance(attendanceTS1, fName, classroom, campus){
  await pool.query('USE LAUSMDB')
  const result = await pool.query('UPDATE DELEGATE SET attendanceTS1 = ? WHERE fName = ? AND tsClass = ? AND dlgCampus = ?', [attendanceTS1, fName, classroom, campus]
  );
  const dID = result.insertId
  return getOneDlg(dID);
}


export async function updateTs2attendance(attendanceTS2, fName, classroom, campus){
  await pool.query('USE LAUSMDB')
  const result = await pool.query('UPDATE DELEGATE SET attendanceTS2= ? WHERE fName = ? AND tsClass = ? AND dlgCampus = ?', [attendanceTS2, fName, classroom, campus]
  );
  const dID = result.insertId
  return getOneDlg(dID);
}

export async function updateMcattendance(mcAttendance){
  await pool.query('USE LAUSMDB')
  const result = await pool.query('UPDATE DELEGATE SET mcAttendance= ?', [mcAttendance]
  );
  const dID = result.insertId
  return getOneDlg(dID);
}


export async function updateFcattendance(fcAttendance){
  await pool.query('USE LAUSMDB')
  const result = await pool.query('UPDATE DELEGATE SET fcAttendance= ?', [fcAttendance]
  );
  const dID = result.insertId
  return getOneDlg(dID);
}

export async function addDlg(dlgID,fName,lName,dlgNB,dlgEmail,dlgSchool,dlgPGM,level,lang,dlgCampus,dlgAdv){
  await pool.query('USE LAUSMDB')
  const result = await pool.query(
  'INSERT INTO delegate (dlgID,fName,lName,dlgNB,dlgEmail,dlgSchool,dlgPGM,level,lang,dlgCampus,dlgAdv) VALUES(?,?,?,?,?,?,?,?,?,?,?)',
  [dlgID,fName,lName,dlgNB,dlgEmail,dlgSchool,dlgPGM,level,lang,dlgCampus,dlgAdv])
  const dID = result.insertId
  return getOneDlg(dID)
}

export async function checkAdvID(advID){
  await pool.query('USE LAUSMDB');
  const exists = await pool.query(
  'SELECT EXISTS ( SELECT 1 FROM ADVISOR WHERE advID = ? ) AS value_exists',[advID]);
  return exists[0][0].value_exists;
}

export async function checkDlgID(dlgID){
  await pool.query('USE LAUSMDB');
  const exists = await pool.query(
  'SELECT EXISTS ( SELECT 1 FROM DELEGATE WHERE dlgID = ? ) AS value_exists',[dlgID]);
  return exists[0][0].value_exists;
}


export async function insertSchool(advSchool){

  await pool.query('USE LAUSMDB')
  await pool.query("INSERT INTO SCHOOL (schoolName,landline,principalName,principalNumber,schoolCmp) VALUES (?,00000000,'UNKNOWN',00000000,'UNKOWN')",[advSchool]);
  
 
}
export async function editSchoolCampus(dlgSchool,dlgCampus){

  await pool.query('USE LAUSMDB')
  await pool.query('UPDATE SCHOOL SET schoolCmp=? WHERE schoolName=?',[dlgCampus,dlgSchool]);
  
 
}


// export async function addAdv(advID,fName,lName,advNB,advEmail,advSchool){
//   await pool.query('USE LAUSMDB')
//   const [schools] = await pool.query(`SELECT schoolName FROM SCHOOL WHERE schoolName=?`,[advSchool]);
//   if(schools.length==0){
//      await insertSchool(advSchool);
//     const result = await pool.query(
//       'INSERT INTO advisor (advID,fName,lName,advNB,advEmail,advSchool,mainAdv) VALUES(?,?,?,?,?,?,?)',
//       [advID,fName,lName,advNB,advEmail,advSchool,advID])
//   }
//   else{
//     const [getquery] = await pool.query(`SELECT mainAdv FROM ADVISOR WHERE advSchool=? `, [advSchool]);
//     const mainAdv=(getquery[0].mainAdv);
//     const result = await pool.query(
//       'INSERT INTO advisor (advID,fName,lName,advNB,advEmail,advSchool,mainAdv) VALUES(?,?,?,?,?,?,?)',
//       [advID,fName,lName,advNB,advEmail,advSchool,mainAdv])
//   }
// }

export async function addAdv(advID, fName, lName, advNB, advEmail, advSchool) {
  await pool.query('USE LAUSMDB');

  const [schools] = await pool.query(`SELECT schoolName FROM SCHOOL WHERE schoolName=?`, [advSchool]);
  if (schools.length === 0) {
    await insertSchool(advSchool);
  }

  const [getquery] = await pool.query(`SELECT mainAdv FROM ADVISOR WHERE advSchool=?`, [advSchool]);

  let mainAdv;
  if (getquery.length === 0) {
    // No advisor for that school → make this advisor the main advisor
    mainAdv = advID;
  } else {
    // At least one advisor exists → use the same mainAdv
    mainAdv = getquery[0].mainAdv;
  }

  await pool.query(
    'INSERT INTO advisor (advID, fName, lName, advNB, advEmail, advSchool, mainAdv) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [advID, fName, lName, advNB, advEmail, advSchool, mainAdv]
  );
}


export async function deleteOneAdv(id){
  await pool.query('USE LAUSMDB')
  const result = await pool.query(
    'DELETE FROM advisor WHERE advID = ?', [id]);
  const deletionSuccessful = result.affectedRows > 0;
  return deletionSuccessful;
}

export async function getOneAdv(id){
  await pool.query('USE LAUSMDB');
  const [rows] = await pool.query('SELECT * FROM advisor WHERE advID = ?',
   [id]);
  return rows; // get the object in the array
}

export async function getAdv(){
  await pool.query('USE LAUSMDB');
  const [rows] = await pool.query('SELECT * FROM advisor');
  return rows;
}

// Call the function to save data to a file
saveDataToFile();

export async function dlgNoClass(dlgPGM,level,lang,dlgCampus){
  await pool.query('USE LAUSMDB');
  const [delegates] = await pool.query(
  'SELECT * FROM DELEGATE WHERE dlgPGM=? AND level=? AND lang=? AND dlgCampus=? AND tsClass IS NULL', 
  [dlgPGM,level,lang,dlgCampus]);
  return delegates;
}

// customizing the query, return the query as a string not the actual relation
export async function dlgNoClassQuery(dlgPGM, level, lang, dlgCampus) {

  const query = `SELECT * FROM DELEGATE WHERE dlgPGM='${dlgPGM}' AND level='${level}' AND lang='${lang}' AND dlgCampus='${dlgCampus}' AND tsClass IS NULL ORDER BY lName`;
  return query;
}

// returns query of a relation of ts classes for PGM
export async function pgmTsClassQuery(pgm, level, lang, campus) {
  const delegates= await dlgNoClassQuery(pgm, level, lang, campus);
  const query = `SELECT * FROM TSCLASS WHERE pgm='${pgm}' AND level='${level}' AND lang='${lang}' AND campus='${campus}' ORDER BY classID`;
  return query;
}

export async function getCapacity(dlgPGM, level, lang, dlgCampus){
await pool.query('USE LAUSMDB');
const classes = await pgmTsClassQuery(dlgPGM, level, lang, dlgCampus);

let [capacity] = await pool.query(`SELECT CAPACITY FROM (${classes}) AS tsClasses LIMIT 1 OFFSET 0`);
return capacity[0].capacity;

}


export async function assignClassPGM(dlgPGM, level, lang, dlgCampus){

  let delegates = await dlgNoClassQuery(dlgPGM, level, lang, dlgCampus);
  const classes = await pgmTsClassQuery(dlgPGM, level, lang, dlgCampus);
  
// getting remaining seats of class at idx i:
await pool.query('USE LAUSMDB');
const [size] = await pool.query(`SELECT COUNT(*) AS num FROM (${classes}) AS classes`);


for(let i=0;i<size[0].num;i++){

   let [currentClass] = await pool.query(`SELECT classID FROM (${classes}) AS classes LIMIT 1 OFFSET ${i}`);
   let [capacity] = await pool.query(`SELECT CAPACITY FROM (${classes}) AS classes WHERE classID ='${currentClass[0].classID}'`);
  
  let  [taken]= await pool.query('SELECT COUNT(*) AS num FROM DELEGATE WHERE TSCLASS=?',[currentClass[0].classID]);
  let remaining = Number(capacity[0].capacity) - taken[0].num;


  if(remaining>0){

await pool.query(`UPDATE DELEGATE
JOIN (
  (${delegates} )
    LIMIT ${remaining}
) AS selectedDlg ON DELEGATE.dlgID = selectedDlg.dlgID
SET DELEGATE.tsClass = ?`,[currentClass[0].classID]);

  }

}
  

  }

  export async function assignTsClass(){
  
   await assignClassPGM('MUN', 'HS', 'EN', 'Byblos');
   await assignClassPGM('MUN', 'MS', 'EN', 'Byblos');
   await assignClassPGM('MUN', 'MS', 'EN', 'Beirut');
   await assignClassPGM('MUN', 'HS', 'EN', 'Beirut');

   await assignClassPGM('MAL', 'HS', 'EN', 'Byblos');
   await assignClassPGM('MAL', 'MS', 'EN', 'Beirut');
   await assignClassPGM('MAL', 'HS', 'EN', 'Beirut');
   await assignClassPGM('MAL', 'MS', 'EN', 'Byblos');

   await assignClassPGM('MAL', 'HS', 'AR', 'Byblos');
   await assignClassPGM('MAL', 'MS', 'AR', 'Beirut');
   await assignClassPGM('MAL', 'HS', 'AR', 'Beirut');
   await assignClassPGM('MAL', 'MS', 'AR', 'Byblos');

   await assignClassPGM('MGG', 'HS', 'EN', 'Byblos');
   await assignClassPGM('MGG', 'HS', 'EN', 'Beirut');
    
   await assignClassPGM('MEU', 'HS', 'EN', 'Byblos');
   await assignClassPGM('MEU', 'HS', 'EN', 'Beirut');
   await assignClassPGM('MEU', 'HS', 'FR', 'Byblos');
   await assignClassPGM('MEU', 'HS', 'FR', 'Beirut');


  }

 await assignTsClass();

  // ATTENDANCE DISPLAY TRAINING SESSION delegates = DELEGATE and classroom = input  
  export async function getAttendanceTS(classroom){
    await pool.query('USE LAUSMDB');
    const [rows] = await pool.query(`SELECT fname,lname FROM DELEGATE WHERE tsCLASS = ? `, [classroom]);
    return rows;
  }

// ATTENDANCE DISPLAY MC table= MCREPRESENTATION nd committee=input class 
export async function getAttendanceMC(committee){
  await pool.query('USE LAUSMDB');
  const [rows] = await pool.query(`SELECT COUNTRYNAME FROM MCREPRESENTATION WHERE committeeID = ? `, [committee]);
  return rows;
}

// ATTENDANCE DISPLAY FC table = FCREPRESENTATION and committee = input class 
export async function getAttendanceFC(committee){
  await pool.query('USE LAUSMDB');
  const [rows] = await pool.query(`SELECT COUNTRYNAME FROM FCREPRESENTATION WHERE committeeID = ?  `, [committee]);
  return rows;
}



export async function getTotalStudents(level,campus){
  await pool.query('USE LAUSMDB');
  const [rows] = await pool.query(`SELECT COUNT(*) AS Total FROM DELEGATE WHERE level = ? AND dlgCampus= ?  `, [level,campus]);
  return rows;
}

// export async function getTotal(){
//   await pool.query('USE LAUSMDB');
//   const [rows] = await pool.query('SELECT dlgPGM AS program, level, dlgCampus AS campus, COUNT(*) AS count FROM DELEGATE GROUP BY dlgPGM, level, dlgCampus');
//   return rows;
// }



//ASSIGNING COUNTRIES

//getlist of delegates with no country yet ONLY QUESRY AS STRING
export async function dlgNoRepQuery() {

  const query = `SELECT dlgID, dlgSchool, dlgPGM, dlgCampus, level,lang, countryRep FROM DELEGATE  WHERE countryRep ='TBA'`;
  return query;
}


//getlist of delegates with no country yet
export async function dlgNoRep() {
  await pool.query('USE LAUSMDB');
  const [delegates] = await pool.query(`SELECT dlgID, dlgSchool, dlgPGM, dlgCampus, level,lang, countryRep FROM DELEGATE  WHERE countryRep ='TBA'`);
  return delegates;
}

//USE FOR TS1 CLASSES
export async function getAttendanceTs1(classroom, campus){
  await pool.query('USE LAUSMDB');
  const [rows] = await pool.query(`SELECT dlgID,fName,lName,attendanceTS1 FROM DELEGATE WHERE tsCLASS = ? AND dlgCampus = ?`, [classroom, campus]);
  return rows;
}

//USE FOR TS2 CLASSES
export async function getAttendanceTs2(classroom, campus){
  await pool.query('USE LAUSMDB');
  const [rows] = await pool.query(`SELECT dlgID,fName,lName,attendanceTS2 FROM DELEGATE WHERE tsCLASS = ? AND dlgCampus = ?`, [classroom, campus]);
  return rows;
}

// USE FOR MC CLASSES
export async function getMCdelegates(mcCommittee, campus){
  await pool.query('USE LAUSMDB');
  const [rows] = await pool.query(`SELECT dlgID,fName,lName,mcAttendance FROM DELEGATE WHERE mcCommittee = ? AND dlgCampus = ?`, [mcCommittee, campus]);
  return rows;
}

//USE FOR FC CLASSES
export async function getFCdelegates(fcCommittee, campus){
  await pool.query('USE LAUSMDB');
  const [rows] = await pool.query(`SELECT dlgID,fName,lName,fcAttendance FROM DELEGATE WHERE fcCommittee = ? AND dlgCampus = ?`, [fcCommittee, campus]);
  return rows;
}

