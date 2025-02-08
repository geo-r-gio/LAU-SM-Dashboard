import React from 'react'

import { Box, Button, TextField } from '@mui/material';
import { Formik } from 'formik';
import * as yup from "yup";
import useMediaQuery from '@mui/material/useMediaQuery';
import Axios from 'axios';

const initialValues = {
  fName: "",
  lName: "",
  advNB: "",
  advEmail: "",
  advSchool: ""
};

const phoneRegExp = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{2})$/;
//const ageRegExp = /^[1-9]?[0-9]{1}$|^100$/;

const userSchema = yup.object().shape({
  fName: yup.string().required("Required"),
  lName: yup.string().required("Required"),
  advNB: yup.string().matches(phoneRegExp, "Phone number is not valid").required("Required"),
  advEmail: yup.string().email("Invalid Email").required("Required"),
  advSchool: yup.string().required("Required"),
})

const AdvisorsForm = () => {
  
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = (values, { resetForm }) => {

    alert(JSON.stringify(values, null, 2));
    //alert('Form has been submitted!')
    console.log(values);

    Axios.post('http://localhost:3000/advisors', values)
    .then(res => { 
      console.log(res)
      resetForm();
     })
    .catch(err => console.log(err))

    // alert(JSON.stringify(values, null, 2));
    // console.log(values);
  }
  
  return (
    <Box m="20px">
      <h2 className="page-header">Advisors Form</h2>

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
                style={{color:"primary"}}
                fullWidth
                variant="filled"
                type="text"
                label="First Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.fName}
                name="fName"
                error={!!touched.fName && !!errors.fName}
                helperText={touched.fName && errors.fName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Last Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lName}
                name="lName"
                error={!!touched.lName && !!errors.lName}
                helperText={touched.lName && errors.lName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Phone Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.advNB}
                name="advNB"
                error={!!touched.advNB && !!errors.advNB}
                helperText={touched.advNB && errors.advNB}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email Address"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.advEmail}
                name="advEmail"
                error={!!touched.advEmail && !!errors.advEmail}
                helperText={touched.advEmail && errors.advEmail}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="School Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.advSchool}
                name="advSchool"
                error={!!touched.advSchool && !!errors.advSchool}
                helperText={touched.advSchool && errors.advSchool}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="primary" variant="contained">
                Add New Advisor
              </Button>
            </Box>
          </form>
        )}
      </Formik>

    </Box>
  )
}

export default AdvisorsForm