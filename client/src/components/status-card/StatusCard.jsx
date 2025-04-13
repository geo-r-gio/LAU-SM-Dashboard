import React, { useEffect, useState } from 'react'
import Axios from 'axios';
import './statuscard.css'

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await Axios.get(`http://localhost:3000/dashboard/${level}/${campus}`);
//         console.log(`Received count data for ${title} on client:`, response.data);
//         setCount(response.data.count);
//       } catch (error) {
//         console.error(`Error fetching count data for ${title}:`, error);
//       }
//     };

//     fetchData();
//   }, [level, campus, title]);

//   return (
//     <div>
//       <div className="status-card">
//         <div className="status-card__icon">
//           <i className={icon}></i>
//         </div>
//         <div className="status-card__info">
//           <h4>{count}</h4>
//           <span>{title}</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StatusCard;


const StatusCard = ({ icon, title, level, campus })  => {
  const [count, setCount] = useState('Loading...');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get(`http://localhost:3000/dashboard/${level}/${campus}`);
   
        //console.log('Response from client:', response);
        //console.log('setcount:', response.data.count);
        if (Array.isArray(response.data) && response.data.length > 0) {
          // Extract the count from the 'Total' property of the first element
          setCount(response.data[0].Total);
        } else {
          console.error(`Invalid data structure received for ${title}:`, response.data);
          setCount('Invalid Data');
        }
      } catch (error) {
        console.error('Error fetching data for ${title}:', error);
      }
    };

    fetchData();
  }, [level, campus, title]);

  return (
    <div>
      <div className="status-card">
        <div className="status-card__icon">
         <i className={icon}></i>
        </div>
        <div className="status-card__info">
          <h4>{count}</h4>
          <span>{title}</span>
        </div>
      </div>
    </div>
  );
};

export default StatusCard
