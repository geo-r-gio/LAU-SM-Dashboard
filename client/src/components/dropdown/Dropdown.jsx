import React from 'react'

import './dropdown.css'
import { useRef } from 'react'

const Dropdown = props => {

    const dropdown_toggle_el = useRef(null)

  return (
    <div className='dropdown'>
        <button ref={dropdown_toggle_el} className="dropdown__toggle">
            {
                props.icon ? <i className={props.icon}></i> : ''
            }
        </button>
    </div>
  )
}

export default Dropdown
