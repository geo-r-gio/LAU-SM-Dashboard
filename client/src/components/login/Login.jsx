import React, { useState } from 'react'

import { BrowserRouter as Router } from 'react-router-dom'

import { Grid, Paper, Button, InputAdornment, IconButton } from '@material-ui/core'

import Input from '@mui/material/Input';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import logo from '../../assets/images/LAUsm.png';

import Axios from 'axios';
import Layout from '../layout/Layout';

const Login = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)  

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleFormSubmit = (event) => {
    event.preventDefault()
    console.log(username, password)
    Axios.post('http://localhost:3000/login', {username, password})
    .then(res => { 
      console.log("Login Successful:", res.data);
      if(res.data == true){
        setIsLoggedIn(true)
      }
    })
    .catch(err => console.log("Login Failed:", err))
  }

  if (isLoggedIn) {
    // <Router>
    //     <Redirect to="/"/>
    // </Router>
   return <>{isLoggedIn && <Layout />}</>
  }


  const svgBackground = `
  <svg id="visual" viewBox="0 0 900 450" width="900" height="450" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
  <rect x="0" y="0" width="900" height="450" fill="#f7f7f7"></rect><defs><linearGradient id="grad1_0" x1="50%" y1="0%" x2="100%" y2="100%"><stop offset="10%"
   stop-color="#f7f7f7" stop-opacity="1"></stop><stop offset="90%" stop-color="#f7f7f7" stop-opacity="1"></stop></linearGradient></defs><defs><linearGradient id="grad2_0"
    x1="0%" y1="0%" x2="50%" y2="100%"><stop offset="10%" stop-color="#f7f7f7" stop-opacity="1"></stop><stop offset="90%" stop-color="#f7f7f7" stop-opacity="1"></stop>
    </linearGradient></defs><g transform="translate(900, 0)"><path d="M0 292.5C-20.8 268.3 -41.7 244.2 -61.9 230.9C-82 217.5
   -101.5 215 -120.5 208.7C-139.5 202.4 -158 192.4 -183.1 183.1C-208.3 173.9 -240.1 165.5 -253.3 146.3C-266.5 127 -261.2 97.1 -264.7 70.9C-268.1
    44.7 -280.3 22.4 -292.5 0L0 0Z" fill="#edb119"></path></g><g transform="translate(0, 450)"><path d="M0 -292.5C28.4 -295.6 56.8 -298.6 75.7 -282.5C94.6
     -266.5 104 -231.2 126 -218.2C148 -205.2 182.7 -214.5 203.6 -203.6C224.6 -192.8 232 -161.9 234.7 -135.5C237.4 -109.1 235.5 -87.3 244.4 -65.5C253.2 -43.7 272.9 -21.8 292.5 0L0 0Z"
      fill="#edb119"></path></g></svg>
`;

  return (
    <div>
        <Router>
                <Grid align='center'>
                    <div
                      style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        background: `url("data:image/svg+xml,${encodeURIComponent(svgBackground)}")`,
                        backgroundSize: 'cover', 
                        overflow: 'hidden',
                      }}
                    ></div>
                    {/* <Paper elevation={10} style={{
                        padding: 20,
                        height:'65vh',
                        width: 400,
                        position: "fixed",
                        top: "50%", 
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        }}> */}
                    {/* <Formik
                      onSubmit={handleFormSubmit}
                      // onSubmit={(values, { setSubmitting }) => {
                      //   handleFormSubmit(values);
                      //   setSubmitting(false);
                      // }}
                      initialValues={initialValues}
                      validationSchema={userSchema}
                    > */}
                    <div>
                     {/* {({ values, handleBlur, handleChange, handleSubmit }) => (      */}
                      <form onSubmit={handleFormSubmit}> 
                        <Paper elevation={10} 
                        style={{
                          padding: 20,
                          height:'65vh',
                          width: 400,
                          position: "fixed",
                          top: "50%", 
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                        }}
                        >     
                        <img src={logo} alt="SM logo" style={{width: '70%', height: '49%', marginTop: "-44px", padding: "20px"}}/>
                        <h2 style={{color: "#717378", marginTop: "-35px"}}>Sign In</h2>
                        {/* <TextField label='Username' placeholder='Enter Username' style={{marginTop: "20px", width: "40ch"}}/> */}
                        <FormControl sx={{ "& .MuiInput-input": { width: "39.7ch" }, marginTop: "20px" }} variant="standard">
                        <InputLabel htmlFor="standard-adornment-username">Username</InputLabel> 
                        <Input
                          id="standard-adornment-username"
                          placeholder='Enter Username'
                          sx={{"input:focus": { border: "0" }}}
                          // onBlur={handleBlur}
                          // onChange={handleChange}
                          // value={values.username}
                          name="username"
                          onChange={e => setUsername(e.target.value)}
                          // value={values.username}
                        />                        
                        {/* <TextField
                          fullWidth
                          variant="filled"
                          type="text"
                          label="Username"
                          // onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.username}
                          name="username"
                          // error={!!touched.username && !!errors.username}
                          // helperText={touched.username && errors.username}
                          sx={{ gridColumn: "span 2" }}
                        /> */}
                        </FormControl>
                        <FormControl sx={{ "& .MuiInput-input": { width: "33.5ch" }, marginTop: "30px" }} variant="standard">
                        <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                        <Input
                          id="standard-adornment-password"
                          placeholder='Enter Password'
                          sx={{"input:focus": { border: "0" }}}
                          type={showPassword ? 'text' : 'password'}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          }
                          // onBlur={handleBlur}
                          // onChange={handleChange}
                          // value={values.password}
                          name="password"
                          onChange={e => setPassword(e.target.value)}
                          // value={values.password}
                        />
                        </FormControl>
                        <Button type="submit" onClick={handleFormSubmit} color="primary" variant="contained" style={{marginTop: "40px"}}>
                          Sign In
                        </Button>
                       </Paper> 
                      </form>
                     {/* )} */}
                    </div> 
                    {/* </Formik> */}
                </Grid>
        </Router>
    </div>
  )
}

export default Login