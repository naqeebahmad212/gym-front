import {useState,useEffect} from 'react'
import axios from 'axios';
import { App_host } from '../Data';
function Attendance() {
    let user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    const activegym = localStorage.getItem("activegym");
    const [attendanceData, setAttendanceData] = useState([]); // State for attendance logs

    const getAttendance = async () => {
      try {
        const response = await axios.get(
          `${App_host}/attendence/getAttendence?jimId=${activegym}`,
          {
            headers: {
              token: token,
            },
          }
        );
  
        const attendanceData = response?.data?.data;
        console.log("attendanceData", attendanceData);
        setAttendanceData(attendanceData)
  
      } catch (error) {
        console.error("Error fetching attendance:", error);
      }
    };

    useEffect(() => {
        getAttendance();
  
      }, []);
    
  return (
    <div className='container'>


         <h1 className='my-5'>Attendance</h1>

         <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Check In Time</th>
              <th>Check Out Time</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((item,index) => (
              <tr key={item._id}>
                <td>{index+1}</td>
                <td>{new Date(item?.punchInTime).toDateString() }</td>
                <td>{ new Date(item?.punchInTime).toLocaleTimeString()   }</td>
                <td>{ new Date(item?.punchOutTime).toLocaleTimeString()   }</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Attendance