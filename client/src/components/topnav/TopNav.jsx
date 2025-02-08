import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

import './topnav.css'

import ThemeMenu from '../thememenu/ThemeMenu'

import Dropdown from '../dropdown/Dropdown'

const Topnav = () => {

  const history = useHistory()
  const [searchQuery, setSearchQuery] = useState('')
  const pages = ['Dashboard', 'Delegates', 'Advisors', 'Attendance', 'Form', 'Settings']

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Perform search logic here, e.g., find the page/item in the list
    const foundPage = pages.find(page => page.toLowerCase() === searchQuery.toLowerCase());

    if (foundPage.toLowerCase() !== 'dashboard') {
      // Navigate to the page if found
      history.push(`/${foundPage.toLowerCase()}`); // Modify the path according to your route structure
    } 
    else if(foundPage.toLowerCase() === 'dashboard') {
      // Navigate to dshboard/main page
      history.push(`/`);
    }
  };


  return (
    <div className='topnav'>
        <div className="topnav__search">
          <form onSubmit={handleSearchSubmit}>
            <input type="text" placeholder='Search here...' value={searchQuery} onChange={handleInputChange}/>
          </form>   
            <i className='bx bx-search'></i> 
        </div>
        <div className="topnav__right">
            <div className="topnav__right-item">
                <ThemeMenu />
                <Dropdown/>
            </div>
        </div>
    </div>
  )
}

export default Topnav
