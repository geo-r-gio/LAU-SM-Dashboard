import React from 'react'

import { Box, Button, TextField } from '@mui/material';
import { Formik } from 'formik';
import * as yup from "yup";
import useMediaQuery from '@mui/material/useMediaQuery';
import Axios from 'axios';

const initialValues = {
  fName: "",
  lName: "",
  dlgNB: "",
  dlgEmail: "",
  dlgSchool: "",
  dlgPGM: "",
  level: "",
  lang: "",
  dlgCampus: "",
  dlgAdv: ""
};

const phoneRegExp = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{2})$/;
//const ageRegExp = /^[1-9]?[0-9]{1}$|^100$/;

const userSchema = yup.object().shape({
  fName: yup.string().required("Required"),
  lName: yup.string().required("Required"),
  dlgEmail: yup.string().email("Invalid Email").required("Required"),
  dlgNB: yup.string().matches(phoneRegExp, "Phone number is not valid").required("Required"),
  dlgSchool: yup.string().required("Required"),
  dlgCampus: yup.string().required("Required"),
  dlgAdv: yup.string().required("Required"),
  dlgPGM: yup.string().required("Required"),
  lang: yup.string().required("Required"),
  level: yup.string().required("Required"),
})

const DelegatesForm = () => {
  
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = (values, { resetForm }) => {

    alert(JSON.stringify(values, null, 2));
    //alert('Form has been submitted!')
    console.log(values);

    Axios.post('http://localhost:3000/delegates', values)
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
      <h2 className="page-header">Delegates Form</h2>

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
                value={values.dlgNB}
                name="dlgNB"
                error={!!touched.dlgNB && !!errors.dlgNB}
                helperText={touched.dlgNB && errors.dlgNB}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email Address"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.dlgEmail}
                name="dlgEmail"
                error={!!touched.dlgEmail && !!errors.dlgEmail}
                helperText={touched.dlgEmail && errors.dlgEmail}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="School Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.dlgSchool}
                name="dlgSchool"
                error={!!touched.dlgSchool && !!errors.dlgSchool}
                helperText={touched.dlgSchool && errors.dlgSchool}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Program of Interest"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.dlgPGM}
                name="dlgPGM"
                error={!!touched.dlgPGM && !!errors.dlgPGM}
                helperText={touched.dlgPGM && errors.dlgPGM}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="HS/MS"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.level}
                name="level"
                error={!!touched.level && !!errors.level}
                helperText={touched.level && errors.level}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Language"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lang}
                name="lang"
                error={!!touched.lang && !!errors.lang}
                helperText={touched.lang && errors.lang}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Campus"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.dlgCampus}
                name="dlgCampus"
                error={!!touched.dlgCampus && !!errors.dlgCampus}
                helperText={touched.dlgCampus && errors.dlgCampus}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Advisor's ID"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.dlgAdv}
                name="dlgAdv"
                error={!!touched.dlgAdv && !!errors.dlgAdv}
                helperText={touched.dlgAdv && errors.dlgAdv}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="primary" variant="contained">
                Add New Delegate
              </Button>
            </Box>
          </form>
        )}
      </Formik>

    </Box>
  )
}

export default DelegatesForm
