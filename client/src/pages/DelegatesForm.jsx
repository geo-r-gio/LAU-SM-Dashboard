import React from 'react'

import { Box, Button, MenuItem, TextField } from '@mui/material';
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

  const [schoolOptions, setSchoolOptions] = React.useState([]);
  const [programOptions, setProgramOptions] = React.useState([]);
  const [levelOptions, setLevelOptions] = React.useState([]);
  const [langOptions, setLangOptions] = React.useState([]);
  const [campusOptions, setCampusOptions] = React.useState([]);
  const [advisorOptions, setAdvisorOptions] = React.useState([]);

  React.useEffect(() => {
    Axios.get('http://localhost:3000/schools')
      .then((res) => {
        const options = res.data.map((school) => ({
          label: school.schoolName,
          value: school.schoolName,
        }));
        setSchoolOptions(options);
      })
      .catch((err) => console.error("Failed to fetch school names", err));
  }, []);

  React.useEffect(() => {
    Axios.get('http://localhost:3000/programs')
      .then((res) => {
        const options = res.data.map((program) => ({
          label: program.dlgPGM,
          value: program.dlgPGM,
        }));
        setProgramOptions(options);
      })
      .catch((err) => console.error("Failed to fetch program names", err));
  }, []);

  React.useEffect(() => {
    Axios.get('http://localhost:3000/levels')
      .then((res) => {
        const options = res.data.map((level) => ({
          label: level.level,
          value: level.level,
        }));
        setLevelOptions(options);
      })
      .catch((err) => console.error("Failed to fetch levels", err));
  }, []);

  React.useEffect(() => {
    Axios.get('http://localhost:3000/languages')
      .then((res) => {
        const options = res.data.map((lang) => ({
          label: lang.lang,
          value: lang.lang,
        }));
        setLangOptions(options);
      })
      .catch((err) => console.error("Failed to fetch languages", err));
  }, []);

  React.useEffect(() => {
    Axios.get('http://localhost:3000/campuses')
      .then((res) => {
        const options = res.data.map((campus) => ({
          label: campus.dlgCampus,
          value: campus.dlgCampus,
        }));
        setCampusOptions(options);
      })
      .catch((err) => console.error("Failed to fetch campuses", err));
  }, []);

  React.useEffect(() => {
    Axios.get('http://localhost:3000/advisorsID')
      .then((res) => {
        const options = res.data.map((advisor) => ({
          label: advisor.dlgAdv,
          value: advisor.dlgAdv,
        }));
        setAdvisorOptions(options);
      })
      .catch((err) => console.error("Failed to fetch advisors ID", err));
  }, []);

  const handleFormSubmit = (values, { resetForm }) => {

    alert(JSON.stringify(values, null, 2));
    console.log(values);

    Axios.post('http://localhost:3000/delegates', values)
    .then(res => { 
      console.log(res)
      resetForm();
     })
    .catch(err => console.log(err))
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
              {/* <TextField
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
              /> */}
              <TextField
                fullWidth
                select
                variant="filled"
                label="School Name"
                name="dlgSchool"
                value={values.advSchool}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.dlgSchool && !!errors.dlgSchool}
                helperText={touched.dlgSchool && errors.dlgSchool}
                sx={{ gridColumn: "span 2" }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      style: {
                        maxHeight: 5 * 48, // 5 items * default item height (48px)
                        overflowY: 'auto'
                      }
                    }
                  }
                }}
              >
                {schoolOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value} sx={{ minHeight: '48px !important' }}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              {/* <TextField
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
              /> */}

              <TextField
                fullWidth
                select
                variant="filled"
                label="Program of Interest"
                name="dlgPGM"
                value={values.dlgPGM}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.dlgPGM && !!errors.dlgPGM}
                helperText={touched.dlgPGM && errors.dlgPGM}
                sx={{ gridColumn: "span 2" }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      style: {
                        maxHeight: 5 * 48, // 5 items * default item height (48px)
                        overflowY: 'auto'
                      }
                    }
                  }
                }}
              >
                {programOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value} sx={{ minHeight: '48px !important' }}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              {/* <TextField
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
              /> */}

              <TextField
                fullWidth
                select
                variant="filled"
                label="HS/MS"
                name="level"
                value={values.level}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.level && !!errors.level}
                helperText={touched.level && errors.level}
                sx={{ gridColumn: "span 2" }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      style: {
                        maxHeight: 5 * 48, // 5 items * default item height (48px)
                        overflowY: 'auto'
                      }
                    }
                  }
                }}
              >
                {levelOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value} sx={{ minHeight: '48px !important' }}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              {/* <TextField
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
              /> */}

              <TextField
                fullWidth
                select
                variant="filled"
                label="Language"
                name="lang"
                value={values.lang}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.lang && !!errors.lang}
                helperText={touched.lang && errors.lang}
                sx={{ gridColumn: "span 2" }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      style: {
                        maxHeight: 5 * 48, // 5 items * default item height (48px)
                        overflowY: 'auto'
                      }
                    }
                  }
                }}
              >
                {langOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value} sx={{ minHeight: '48px !important' }}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
{/* 
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
              /> */}

              <TextField
                fullWidth
                select
                variant="filled"
                label="Campus"
                name="dlgCampus"
                value={values.dlgCampus}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.dlgCampus && !!errors.dlgCampus}
                helperText={touched.dlgCampus && errors.dlgCampus}
                sx={{ gridColumn: "span 2" }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      style: {
                        maxHeight: 5 * 48, // 5 items * default item height (48px)
                        overflowY: 'auto'
                      }
                    }
                  }
                }}
              >
                {campusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value} sx={{ minHeight: '48px !important' }}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              {/* <TextField
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
              /> */}

              <TextField
                fullWidth
                select
                variant="filled"
                label="Advisor's ID"
                name="dlgAdv"
                value={values.dlgAdv}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.dlgAdv && !!errors.dlgAdv}
                helperText={touched.dlgAdv && errors.dlgAdv}
                sx={{ gridColumn: "span 2" }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      style: {
                        maxHeight: 5 * 48, // 5 items * default item height (48px)
                        overflowY: 'auto'
                      }
                    }
                  }
                }}
              >
                {advisorOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value} sx={{ minHeight: '48px !important' }}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
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
