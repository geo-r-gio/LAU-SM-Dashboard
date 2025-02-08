import React from 'react'

import { Box, Button, MenuItem, TextField } from '@mui/material';
import { Formik } from 'formik';
import * as yup from "yup";
import useMediaQuery from '@mui/material/useMediaQuery';
import Axios from 'axios';
import Sessions from '../tables/Sessions';
// import ByblosTs1 from '../tables/Byblos';
import { useState } from 'react';

const dropdownOptions = [
  //{key: 'Select a session', value: ''},
  {key: 'Training Session 1', value: 'ts1'},
  {key: 'Training Session 2', value: 'ts2'},
  {key: 'Mock Conference', value: 'mc'},
  // {key: 'Final Conference 1', value: 'fc1'},
  {key: 'Final Conference ', value: 'fc'},
]

const initialValues = {
  campus: "",
  session: "",
  class: "",
};

const userSchema = yup.object().shape({
  campus: yup.string().required("Required"),
  session: yup.string().required("Required"),
  class: yup.string().required("Required"),
})

const Attendance = () => {
  
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [showTable, setShowTable] = useState(false);



    const handleFormSubmit = (values) => {
      console.log(values);
    
      alert(JSON.stringify(values, null, 2));
    
      if (values.session === 'ts1' || values.session === 'ts2') {
       
        const url = `http://localhost:3000/attendance/${values.class}/delegates`;
    
        Axios.get(url)
          .then(res => {
            // console.log(res);
            const responseData = res.data;
            console.log('Response Data:', responseData);
           setShowTable(true);
         
          })
          .catch(err => console.log(err));
      } else {
       
        const url = `http://localhost:3000/attendance/${values.class}/mcrepresentatives`;
    
        Axios.get(url)
          .then(res => {
            // console.log(res);
            const responseData = res.data;

           
            console.log('Response Data:', responseData);
          })
          .catch(err => console.log(err));
      } 
      // else if(values.class=='mc')
      // else {
       
      //   const url = `http://localhost:3000/attendance/${values.class}/fcrepresentatives`;
    
      //   Axios.get(url)
      //     .then(res => {
      //       // console.log(res);
      //       const responseData = res.data;

           
      //       console.log('Response Data:', responseData);
      //     })
      //     .catch(err => console.log(err));
      // } 
    }
    
  return (
    <Box m="20px">
      <h2 className="page-header">Attendance</h2>

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={userSchema}
      >
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Box display="grid" gap="30px" gridTemplateColumns="repeat(4, minmax(0, 1fr))" 
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4"},
              "& .MuiFormLabel-root": { color: "var(--txt-color)" },
              "& .MuiFilledInput-input": { color: "var(--txt-color)" },
            }}>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Campus"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.campus}
                name="campus"
                error={!!touched.campus && !!errors.campus}
                helperText={touched.campus && errors.campus}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Select a session"
                select
                id="session"
                name="session"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.session}
                error={!!touched.session && !!errors.session}
                helperText={touched.session && errors.session}
                sx={{ gridColumn: "span 4" }}
              >
                {dropdownOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                  {option.key}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Class"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.class}
                name="class"
                error={!!touched.class && !!errors.class}
                helperText={touched.class && errors.class}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="primary" variant="contained">
                Submit
              </Button>
            </Box>
            {showTable && <Sessions data={showTable}  
            classValue={values?.class} 
            tsValue={values?.session} 
            campusValue={values?.campus}
            mcValue={values?.session}
            fcValue={values?.session}/>}
          </form>
        )}
      </Formik>

      {/* {showTable === 'be-ts1-AKSOB406' && <Sessions />}
      {showTable === 'by-ts1-ZK406' && <ByblosTs1 />} */}
      

    </Box>
  )
}

export default Attendance