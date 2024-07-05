import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { App_host } from '../../Data';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' ,
    },
    title: {
      display: true,
      text: 'Chart.js Bar Chart',
    },
  },
};




 

const PeakHoursBars = () => {
  const [peakHoursData, setPeakHoursData] = useState(
    [

  ]
  );
  const [maxActiveUsers, setMaxActiveUsers] = useState(0);
  const token = localStorage.getItem('token');
  const activegym = localStorage.getItem("activegym");
  let user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchPeakHoursData = async () => {

      console.log("user",user)
      try {
        const response = await axios.get(`${App_host}/attendence/getPeakHours`, {
          params: {
            gymId: activegym,
            user:user,
            isGymAdmin:false
          },
          headers: {
            token: token
          }
        });
        console.log("getPeakHours===",response.data.data)
        setPeakHoursData(response.data.data);
        // console.log(peakHoursData)

        const values = Object.values(peakHoursData);
        const maxQuantity = Math.max(...values);
        setMaxActiveUsers(maxQuantity);
      } catch (error) {
        console.error('Error fetching peak hours data:', error);
      }
    };

    fetchPeakHoursData();
  }, [activegym, token]);


   // Prepare data for Chart.js
   const chartData = {
    labels: peakHoursData?.map((item)=>item.time), // Replace with your own labels
    datasets: [
      {
        label: 'Dataset 1',
        data: peakHoursData?.map((item)=>item.count), // Replace with your own data
        backgroundColor: '#7367f0',
      },
    
    ],
  };
  return (
    <div className="text-white p-3" style={{ width: "100%", backgroundColor: "rgb(237 237 237)", borderRadius: "1rem", height: "100%" }}>
    <h5 style={{ fontSize: "14px" }}>Peak hours</h5>
    <div className="row p-2">
   
      <div className='col-10'>
        <div className="row col-12">
          {/* Render Bar chart */}
          <Bar options={options} data={chartData} />
        </div>
      </div>
    </div>
  </div>
  );
};

export default PeakHoursBars;
