import React from 'react'

import StatusCard from '../components/status-card/StatusCard'

import Table from '../components/table/Table'

import statusCards from '../assets/JsonData/status-card-data.json'
import { Link } from 'react-router-dom'

const students = {
  head: [
    'program',
    'beirut',
    'bey available seats',
    'byblos',
    'byb available seats',

  ],
  body: [
    {
      "prog": "MUN HS",
      "bey": "16",
      "beyav": "16",
      "byb": "16",
      "bybav": "16",

    },
    {
      "prog": "MUN MS",
      "bey": "8",
      "beyav": "10",
      "byb": "10",
      "bybav": "10",

    },
    {
      "prog": "MUN Total",
      "bey": "24",
      "beyav": "26",
      "byb": "26",
      "bybav": "26",
    
    },
    {
      "prog": "MAL HS",
      "bey": "12",
      "beyav": "16",
      "byb": "14",
      "bybav": "16",

    },

    {
      "prog": "MAL MS",
      "bey": "8",
      "beyav": "10",
      "byb": "7",
      "bybav": "10",

    },
    {
      "prog": "MAL Total",
      "bey": "36",
      "beyav": "42",
      "byb": "31",
      "bybav": "42",

    },
    {
      "prog": "MEU",
      "bey": "8",
      "beyav": "8",
      "byb": "8",
      "bybav": "8",

    },
    
    {
      "prog": "MEU Total",
      "bey": "14",
      "beyav": "16",
      "byb": "16",
      "bybav": "16",
    
    },
    {
      "prog": "MGG",
      "bey": "12",
      "beyav": "16",
      "byb": "14",
      "bybav": "16",
      
    },
    {
      "prog": "Totals",
      "bey": "86",
      "beyav": "100",
      "byb": "87",
      "bybav": "100",
      
    },
  ]
}

const sessions = {
  head: [
    'session',
    'campus',
    'date'
  ],
  body: [
    {
      "sess": "Training Session 1",
      "cam": "Beirut",
      "dat": "September 9, 2024",
    },
    {
      "sess": "Training Session 1",
      "cam": "Byblos",
      "dat": "September 16, 2024",
    },
    {
      "sess": "Training Session 2",
      "cam": "Beirut",
      "dat": "September 23, 2024",
    },
    {
      "sess": "Training Session 2",
      "cam": "Byblos",
      "dat": "October 7, 2024",
    },
    {
      "sess": "Mock Conference",
      "cam": "Beirut/Byblos",
      "dat": "November 25, 2024",
    },
    {
      "sess": "Final Conference",
      "cam": "Beirut",
      "dat": "May 9, 2025",
    },
    {
      "sess": "Final Conference",
      "cam": "Byblos",
      "dat": "May 16, 2025",
    }
  ]    
}

const renderStudentHead = (item, index) => (
  <th key={index}>{item}</th>
)

const renderStudentBody =(item, index) => (
  <tr key={index}>
    <td>{item.prog}</td>
    <td>{item.bey}</td>
    <td>{item.beyav}</td>

    <td>{item.byb}</td>
    <td>{item.bybav}</td>

  </tr>
)

const renderSessionHead = (item, index) => (
  <th key={index}>{item}</th>
)

const renderSessionBody =(item, index) => (
  <tr key={index}>
    <td>{item.sess}</td>
    <td>{item.cam}</td>
    <td>{item.dat}</td>
  </tr>
)

const Dashboard = () => {
  const statusCards = [
    { "icon": "bx bx-group", "title": "Total HS Students Byblos", "level": "HS", "campus": "Byblos" },
    { "icon": "bx bx-group", "title": "Total HS Students Beirut", "level": "HS", "campus": "Beirut" },
    { "icon": "bx bx-group", "title": "Total MS Students Byblos", "level": "MS", "campus": "Byblos" },
    { "icon": "bx bx-group", "title": "Total MS Students Beirut", "level": "MS", "campus": "Beirut" },
  ];
  
  return (
    <div>
      <h2 className="page-header">Dashboard</h2>
      <div className="row">
        <div className="col-6">
        <div className="row">
        {statusCards.map((item, index) => (
          <div className="col-6" key={index}>
            <StatusCard
              icon={item.icon}
              title={item.title}
              level={item.level}
              campus={item.campus}
            />
          </div>
        ))}
      </div>
        </div>
        <div className="col-6">
          <div className="card full-height">
          <Table
                  headData={sessions.head}
                  renderHead={(item, index) => renderSessionHead(item, index)}
                  bodyData={sessions.body}
                  renderBody={(item, index) => renderSessionBody(item, index)}
              />
          </div>
        </div>
        <div className="col-4">
          <div className="card">
            <div className="card__header">
              <h3>2023 - 2024</h3>
            </div>
            <div className="card__body">
              <Table
                  headData={students.head}
                  renderHead={(item, index) => renderStudentHead(item, index)}
                  bodyData={students.body}
                  renderBody={(item, index) => renderStudentBody(item, index)}
              />
            </div>
            {/* <div className="card__footer">
              <Link to='/'>view all</Link>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
