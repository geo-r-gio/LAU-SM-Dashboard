import mysql from 'mysql2'
import fs from 'fs/promises'
import dotenv from 'dotenv'
dotenv.config()


const pool = mysql.createPool({
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


//generating adv id
// let existing = [100, 101];

// async function advIdGen() {
//   try {
//     let randVal = 0;

// do {
//   randVal = Math.round(100 + Math.random() * (999 - 100));

// } while (existing.includes(randVal));

// const advID = 'A'.concat(randVal.toString());
// existing.push(randVal);

// console.log(existing);
// console.log(advID);
    
//   } catch (error) {
//     console.error('Error:', error);
//   } 
// }







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
    console.log('Data successfully written to data.json');
  } catch (error) {
    console.error('Error:', error);
  } 
}

export async function signin(username, password) {
  // const hashedPassword = await bcrypt.hash(password, 10); // generate password hash in your application
  await pool.query('USE LAUSMDB')
  const [query] = await pool.query('SELECT * FROM login WHERE username = ? AND password = ?', [username, password]);
  // const [rows] = await pool.query(query, [username, hashedPassword]);
  let flag = false;


  if(query.length!=0){
  flag=true;}
  return flag;
}


// prepared statemet to avoid mysql injections
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

// const delegates = await getDlg();
// console.log("getting all delegates");
// console.log(delegates);


// const deleteDlg = await deleteOneDlg('D');
// console.log("getting delegte B2004");
// console.log(deleteDlg);


// update/edit delegate
// export async function updateOneDlg(fName,lName,dlgNB,dlgEmail,dlgSchool,dlgPGM,level,lang,dlgCampus,dlgAdv,dlgID){
//   await pool.query('USE LAUSMDB')
//   const result = await pool.query(
//     'UPDATE delegate SET fName=?,lName=?,dlgNB=?,dlgEmail=?,dlgSchool=?,dlgPGM=?,level=?,lang=?,dlgCampus=?,dlgAdv=? WHERE dlgID=?'
//     , [fName,lName,dlgNB,dlgEmail,dlgSchool,dlgPGM,level,lang,dlgCampus,dlgAdv,dlgID]);
//   const dID = result.insertId
//   return getOneDlg(dID);
// }

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

// const editDelegate = await updateOneDlg('Georgio Nassar', 'D3006');
// console.log("updating delegte B3006");
// console.log(editDelegate);

//OR
// const result =  await pool.query("SELECT * FROM DELEGATE");
// console.log(result[0]);

// export async funciton getOneDlg(id){
//   const [rows] = await pool.query(
  //'SELECT * FROM delegate WHERE dlgID = ?', [id]);
//   return rows; // get the object in the array
  
//   }

//adding to the db

export async function addDlg(dlgID,fName,lName,dlgNB,dlgEmail,dlgSchool,dlgPGM,level,lang,dlgCampus,dlgAdv){
  await pool.query('USE LAUSMDB')
  const result = await pool.query(
  'INSERT INTO delegate (dlgID,fName,lName,dlgNB,dlgEmail,dlgSchool,dlgPGM,level,lang,dlgCampus,dlgAdv) VALUES(?,?,?,?,?,?,?,?,?,?,?)',
  [dlgID,fName,lName,dlgNB,dlgEmail,dlgSchool,dlgPGM,level,lang,dlgCampus,dlgAdv])
  const dID = result.insertId
  return getOneDlg(dID)
}
// export async function addAdv(advID,fName,lName,advNB,advEmail,advSchool){
//   await pool.query('USE LAUSMDB')
//   const result = await pool.query(
//   'INSERT INTO advisor (advID,fName,lName,advNB,advEmail,advSchool) VALUES(?,?,?,?,?,?)',
//   [advID,fName,lName,advNB,advEmail,advSchool])
//   const aID = result.insertId
//   return getOneAdv(aID)
// }

export async function checkAdvID(advID){
  await pool.query('USE LAUSMDB');
  const exists = await pool.query(
  'SELECT EXISTS ( SELECT 1 FROM ADVISOR WHERE advID = ? ) AS value_exists',[advID]);
  console.log( exists[0][0].value_exists);
  return exists[0][0].value_exists;
}

export async function checkDlgID(dlgID){
  await pool.query('USE LAUSMDB');
  const exists = await pool.query(
  'SELECT EXISTS ( SELECT 1 FROM DELEGATE WHERE dlgID = ? ) AS value_exists',[dlgID]);
  console.log(dlgID, exists[0][0].value_exists);
  return exists[0][0].value_exists;
}


// export async function getMainAdv(advSchool){
//   await pool.query('USE LAUSMDB');
//   const [isSchool] = pool.query(`SELECT * FROM SCHOOL WHERE schoolName=?`,[advSchool]);
  
//   if(isSchool.length!=0){
//   const [mainAdv] = await pool.query(`SELECT mainAdv FROM ADVISOR WHERE advSchool=? `, [advSchool]);
//   return (mainAdv[0].mainAdv);}

//   else{
//     await insertSchool();
//   }
// }

export async function insertSchool(advSchool){

  await pool.query('USE LAUSMDB')
  await pool.query("INSERT INTO SCHOOL (schoolName,landline,principalName,principalNumber,schoolCmp) VALUES (?,00000000,'UNKNOWN',00000000,'UNKOWN')",[advSchool]);
  
 
}
export async function editSchoolCampus(dlgSchool,dlgCampus){

  await pool.query('USE LAUSMDB')
  await pool.query('UPDATE SCHOOL SET schoolCmp=? WHERE schoolName=?',[dlgCampus,dlgSchool]);
  
 
}


export async function addAdv(advID,fName,lName,advNB,advEmail,advSchool){
  await pool.query('USE LAUSMDB')
  const [schools] = await pool.query(`SELECT schoolName FROM SCHOOL WHERE schoolName=?`,[advSchool]);
  if(schools.length==0){
    //add school in db and set main adv as advid
    // await pool.query("INSERT INTO SCHOOL (`schoolName) VALUES (?)",[advSchool]);
    // await pool.query(`UPDATE SCHOOL SET mainAdv=? WHERE schoolName=?`, [advID,advSchool]);
    await insertSchool(advSchool);
    const result = await pool.query(
      'INSERT INTO advisor (advID,fName,lName,advNB,advEmail,advSchool,mainAdv) VALUES(?,?,?,?,?,?,?)',
      [advID,fName,lName,advNB,advEmail,advSchool,advID])
  }
  else{
    const [getquery] = await pool.query(`SELECT mainAdv FROM ADVISOR WHERE advSchool=? `, [advSchool]);
  const mainAdv=(getquery[0].mainAdv);
    const result = await pool.query(
      'INSERT INTO advisor (advID,fName,lName,advNB,advEmail,advSchool,mainAdv) VALUES(?,?,?,?,?,?,?)',
      [advID,fName,lName,advNB,advEmail,advSchool,mainAdv])
  }
 
  // const aID = result.insertId
  // return getOneAdv(aID)
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

// const result = await addDlg( 'D3006','Hiba','El Baalbaki','76850885','none@gmail.com','grade12','MUN','EN','HS','ndu')
//  console.log('adding newid\n')
//  console.log(result)

// advIdGen();


// bhess ma ela aaze
export async function dlgNoClass(dlgPGM,level,lang,dlgCampus){
  await pool.query('USE LAUSMDB');
  const [delegates] = await pool.query(
  'SELECT * FROM DELEGATE WHERE dlgPGM=? AND level=? AND lang=? AND dlgCampus=? AND tsClass IS NULL', 
  [dlgPGM,level,lang,dlgCampus]);
  return delegates;
}

// const test = await dlgNoClass('MUN','MS','EN','Beirut');
// console.log(test);

// export async function useDB(){
//   const query = await pool.query(`USE LAUSMDB`);
//   return query;
// }

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



// should return the relation based on a condition
// export async function testingLayla(){
//   await pool.query('Use LAUSMDB');
//   const test = await dlgNoClassQuery('MUN','MS','EN','Beirut');
//   const [answer] = await pool.query(
//     `SELECT * FROM (${test}) AS dlgNoClass WHERE dlgNoClass.dlgID=?`, ['D2200']);
  
//   return answer;
// }

// bhess ma ela aaze too
export async function getCapacity(dlgPGM, level, lang, dlgCampus){
await pool.query('USE LAUSMDB');
// const delegates = await dlgNoClassQuery(dlgPGM, level, lang, dlgCampus);
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
//assign classes
// await pool.query(`UPDATE DELEGATE SET tsClass = ? WHERE dlgID IN (SELECT dlgID FROM (${delegates}) AS selectedDlg LIMIT ${remaining})`, [currentClass[0].classID]);

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

  // TESTING
  // const classes = await pgmTsClassQuery('MUN','MS','EN','Beirut');
  // let [currentClass] = await pool.query(`SELECT classID FROM (${classes}) AS classes LIMIT 1 OFFSET 0`);
  // let [capacity] = await pool.query(`SELECT CAPACITY FROM (${classes}) AS classes WHERE classID ='${currentClass[0].classID}'`);
  // let [taken] = await pool.query('SELECT Count(*) AS num FROM DELEGATE WHERE TSCLASS=?',[currentClass[0].classID]);
  // console.log(Number(capacity[0].capacity) );

// await  assignClassPGM('MUN', 'HS', 'EN', 'Byblos');





 await assignTsClass();
  console.log('DONE');











  // ATTENDANCE DISPLAY TRAINING SESSION delegates = DELEGATE and classroom = input  
  export async function getAttendanceTS(classroom){
    await pool.query('USE LAUSMDB');
    const [rows] = await pool.query(`SELECT fname,lname FROM DELEGATE WHERE tsCLASS = ? `, [classroom]);
    return rows;
  }

//    export async function getAttendanceTS(){
//     await pool.query('USE LAUSMDB');
//     const [rows] = await pool.query(`SELECT fname,lname,attendanceTS1 FROM DELEGATE WHERE tsCLASS ='FR301' `);
//     return rows;
//   }

// export async function getBeirutTs1(){
//   await pool.query('USE LAUSMDB');
//   const [rows] = await pool.query(`SELECT dlgID,fName,lName,attendanceTS1 FROM DELEGATE WHERE tsCLASS = 'FR301'`);
//   return rows;
// }

//   const attend = await getAttendanceTS('FR301');
// console.log('delegates attending fr301: ',attend);

// ATTENDANCE DISPLAY MC table= MCREPRESENTATION nd committee=input class 
export async function getAttendanceMC(committee){
  await pool.query('USE LAUSMDB');
  const [rows] = await pool.query(`SELECT COUNTRYNAME FROM MCREPRESENTATION WHERE committeeID = ? `, [committee]);
  return rows;
}
// const attend = await getAttendanceMC('AP');
// console.log(attend);

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





// const test = await getTotalStudents('HS','Byblos');
// console.log('total from database query: ',test);
// const [test]= await pool.query(`SELECT repID,country_org FROM REPRESENTATION WHERE PGM='MUN' AND LEVEL ='HS' AND LANG ='EN'AND CAMPUS='Byblos'`);
// console.log(test);


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



                          // export async function assignRep(){
                          //   await pool.query('USE LAUSMDB');
                          //   let delegates = await dlgNoRepQuery(); // got the list of delegates with no country
                          // console.log('delegates quesry: ',delegates);
                          // let updated  = await dlgNoRep();
                          // console.log(updated);
                          //   const [size] = await pool.query(`SELECT COUNT(*) AS num FROM (${delegates}) AS delegates`);
                          //   console.log('size: ',size[0].num);
                          //   //for each program
                          // // get constants

                          // // 
                          // for(let i=0;i<size[0].num;i++){
                          //   console.log(i);
                          //   await pool.query('USE LAUSMDB');
                          //   let [currentDlg] = await pool.query(`SELECT dlgID FROM (${delegates}) AS delegate LIMIT 1 OFFSET ${i}`);
                            
                          //   let [pgm] = await pool.query(`SELECT dlgPGM FROM (${delegates}) AS delegates WHERE dlgID ='${currentDlg[0].dlgID}'`);
                          //   let [level] = await pool.query(`SELECT level FROM (${delegates}) AS delegates WHERE dlgID ='${currentDlg[0].dlgID}'`);
                          //   let [lang] = await pool.query(`SELECT lang FROM (${delegates}) AS delegates WHERE dlgID ='${currentDlg[0].dlgID}'`);
                          //   let [school] = await pool.query(`SELECT dlgSchool FROM (${delegates}) AS delegates WHERE dlgID ='${currentDlg[0].dlgID}'`);
                          //   let [campus] = await pool.query(`SELECT dlgCampus FROM (${delegates}) AS delegates WHERE dlgID ='${currentDlg[0].dlgID}'`);
                          //   console.log('current dlg:', currentDlg);
                          //   console.log('School:', school);
                          // console.log('PGM:', pgm);
                          // console.log('Level:', level);
                          // console.log('Lang:', lang);
                          // console.log('Campus:', campus);
                          //   //list of countries compatible with the current delegate aka if a delegate from the same school is already assigned a country

                          // let [reps]=await pool.query(`SELECT repID,country_org FROM REPRESENTATION WHERE PGM=? AND LEVEL =? AND LANG =? AND CAMPUS=?`,
                          // [pgm[0].dlgPGM,level[0].level,lang[0].lang,campus[0].dlgCampus]);
                          // console.log('reps size:',reps.length);

                          // if(reps.length===0){
                          //   console.log('before updatingreps, reps ====0');
                          //   let [set]=await pool.query(`SELECT repID,country_org FROM REPRESENTATION WHERE SCHOOL IS NOT NULL AND PGM=? AND LEVEL =? AND LANG =? AND CAMPUS=?`, 
                          // [pgm[0].dlgPGM,level[0].level,lang[0].lang,campus[0].dlgCampus]);
                          // console.log('reps2:',reps);
                          // let currentSchool = school[0].dlgSchool;
                          //   let countryToAssign=set[0].country_org;
                            
                          
                          //   await pool.query(`UPDATE DELEGATE SET countryRep = ? WHERE dlgSchool =?`, [countryToAssign,currentSchool]);
                          //   await pool.query(`UPDATE REPRESENTATION SET school = ? WHERE pgm=? AND level=? AND lang=? AND campus=?`, [currentSchool,countryToAssign,pgm[0].dlgPGM,level[0].level,lang[0].lang,campus[0].dlgCampus]);


                          

                          // }

                          // else{
                          //   let countryToAssign=reps[0].country_org;
                          // let currentSchool = reps[0].school;

                          // await pool.query(`UPDATE DELEGATE SET countryRep = ? WHERE dlgSchool =?`, [countryToAssign,currentSchool]);
                          

                          // }
                            

                          // }}










// export async function assignRep(){
//   await pool.query('USE LAUSMDB');

//   //ordered list of delegates with no country
//  let size=0;
//   do{
//   let [delegates] = await pool.query(`SELECT dlgID,dlgSchool,dlgPGM,level,lang,dlgCampus,countryRep from delegate WHERE countryRep='TBA' ORDER BY DLGSCHOOL,DLGPGM,LEVEL,LANG,DLGCAMPUS`) 
// console.log(delegates);

//  size=delegates.length;
// console.log(size);


//   await pool.query('USE LAUSMDB');
//   let currentDlg = delegates[0].dlgID;
//     console.log('current dlg:', currentDlg);
//   let pgm = delegates[0].dlgPGM;
//   let level = delegates[0].level;
//   let lang = delegates[0].lang;
//   let campus = delegates[0].dlgCampus;
//   let school = delegates[0].dlgSchool;

//   console.log('School:', school);
// console.log('PGM:', pgm);
// console.log('Level:', level);
// console.log('Lang:', lang);
// console.log('Campus:', campus);
//   //list of countries compatible with the current delegate aka if a delegate from the same school is already assigned a country

//  let [reps]=await pool.query(`SELECT repID,country_org FROM REPRESENTATION WHERE PGM=? AND LEVEL =? AND LANG =? AND CAMPUS=? AND SCHOOL IS NULL` ,
//  [pgm,level,lang,campus]);
// console.log('reps size:',reps.length);


// // const [sameSchool] = await pool.query(`SELECT COUNT(*) AS num from DELEGATE where dlgSchool=?`,[school]);
// let [samepgm] = await pool.query(`SELECT COUNT(*) AS num from delegate where dlgPGM=? AND LEVEL=? AND LANG=? AND DLGCAMPUS=? AND DLGSCHOOL=?`,[pgm,level,lang,campus,school]);
// // console.log(sameSchool[0].num);
// console.log(samepgm[0].num);


// // const limit = sameSchool[0].num - samepgm[0].num;
// // console.log('limit: ',limit);

// let limit = samepgm[0].num;
// console.log('limit: ',limit);


// let [set]= await pool.query(`SELECT dlgID from (SELECT dlgID,dlgSchool,dlgPGM,level,lang,dlgCampus,countryRep from delegate ORDER BY DLGSCHOOL,DLGPGM,LEVEL,LANG,DLGCAMPUS) AS SELECTED LIMIT ${limit}`);

// console.log('ordered delegates from same pgm: ',set);


// let [country]= await pool.query(`SELECT country_org FROM REPRESENTATION  WHERE pgm=? AND LANG=? AND LEVEL=? AND CAMPUS=? AND SCHOOL IS NULL ORDER BY country_org`,[pgm,lang,level,campus]);

// console.log('country: ',country);


// let selectedCountry=country[0].country_org;
// console.log(selectedCountry);

// for(let i=1;i<=limit;i++){
// await pool.query(`UPDATE DELEGATE SET CountryRep= '${selectedCountry}' WHERE dlgID IN (SELECT dlgID from (SELECT dlgID,dlgSchool,dlgPGM,level,lang,dlgCampus,countryRep from delegate ORDER BY DLGSCHOOL,DLGPGM,LEVEL,LANG,DLGCAMPUS) AS SELECED)`);
// }
// await pool.query(`UPDATE REPRESENTATION SET SCHOOL = '${school}' WHERE country_org = '${selectedCountry}'`);



// } while(size>0);
// }







// let [school] = await pool.query(`SELECT dlgSchool FROM DELEGATE AS delegates WHERE dlgID ='D1000'`);
// console.log(school);
// await assignRep();


  // export async function updateTs1attendance(attendanceTS1){
  //   await pool.query('USE LAUSMDB')
  //   const result = await pool.query(`UPDATE DELEGATE SET attendanceTS1= ?`, [attendanceTS1]
  //   );
  //   const dID = result.insertId
  //   return getOneDlg(dID);
  // }


  // export async function updateTs2attendance(attendanceTS2){
  //   await pool.query('USE LAUSMDB')
  //   const result = await pool.query(`UPDATE DELEGATE SET attendanceTS2= ?`, [attendanceTS2]
  //   );
  //   const dID = result.insertId
  //   return getOneDlg(dID);
  // }

  // export async function updateTs1attendance(mcAttendance){
  //   await pool.query('USE LAUSMDB')
  //   const result = await pool.query(`UPDATE DELEGATE SET mcAttendance= ?`, [mcAttendance]
  //   );
  //   const dID = result.insertId
  //   return getOneDlg(dID);
  // }


  // export async function updateTs2attendance(fcAttendance){
  //   await pool.query('USE LAUSMDB')
  //   const result = await pool.query(`UPDATE DELEGATE SET fcAttendance= ?`, [fcAttendance]
  //   );
  //   const dID = result.insertId
  //   return getOneDlg(dID);
  // }


  
//USE FOR TS1 CLASSES
// export async function getBeirutTs1(classroom){
//   await pool.query('USE LAUSMDB');
//   const [rows] = await pool.query(SELECT dlgID,fName,lName,attendanceTS1 FROM DELEGATE WHERE tsCLASS = ?, [classroom]);
//   return rows;
// }

//USE FOR TS1 CLASSES
export async function getBeirutTs1(classroom, campus){
  await pool.query('USE LAUSMDB');
  const [rows] = await pool.query(`SELECT dlgID,fName,lName,attendanceTS1 FROM DELEGATE WHERE tsCLASS = ? AND dlgCampus = ?`, [classroom, campus]);
  return rows;
}

//USE FOR TS2 CLASSES
export async function getBeirutTs2(classroom, campus){
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

