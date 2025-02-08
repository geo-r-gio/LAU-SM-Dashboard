// generating a unique random id between A[100,999] for advisors and D[1000 and 9999] for delegates

// export async function addAdv(advID, fName, lName, advNB, advEmail, advPGM, advSchool, mainAdv){
//   const result = await pool.query(
//     'INSERT INTO advisor VALUES(?,?,?,?,?,?,?,?)',
//   [advID, fName, lName, advNB, advEmail, advPGM, advSchool, mainAdv])
//   const dID = result.insertId
//   return getOneAdv(id)
// }


// create random value and insert in array


let existing = [100, 101];
let randVal = 0;

do {
  randVal = Math.round(100 + Math.random() * (999 - 100));

} while (existing.includes(randVal));

const advID = 'A'.concat(randVal.toString());
existing.push(randVal);

console.log(existing);
console.log(advID);


// async function advIDGen() {
//   try {
//     const data = await getDlg();

//     // Format the data as JSON
//     const jsonData = JSON.stringify(data, null, 2);

//     // Write JSON data to a file
//     await fs.writeFile('newdlgData.json', jsonData, 'utf8');
//     console.log('Data successfully written to data.json');
//   } catch (error) {
//     console.error('Error:', error);
//   } 
// }


// app.post("/advisors", async (req,res) => {
//   const {fName, lName, advNB, advEmail, advPGM, advSchool, mainAdv} = req.body
//   const advID = advIDGen();
//   const advisor = await addAdv(advID,fName, lName, advNB, advEmail, advPGM, advSchool, mainAdv)
//   res.status(201).send(delegate)
// })
