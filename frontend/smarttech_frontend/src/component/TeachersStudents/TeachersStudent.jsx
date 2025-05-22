import { BarChart } from '@mui/x-charts/BarChart';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';



const TeachersStudent = () => {

  const[allStudent,setAllStudent] = useState([])
  const [chartData, setChartData] = useState({ labels: [], notes: [], niveaux: [] });
  const niveauMapping = {
    Beginner: 1,
    Intermediate:2,
    Advanced: 3,
   
  };
  
  const fetchStudent = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      let enseignantId = "";
  
      if (token) {
        const decodedToken = jwtDecode(token);
        enseignantId = decodedToken.sub;
      }
  
      const response = await fetch(`http://localhost:9000/api/AllUser/${enseignantId}`);
      const data = await response.json();
  
      setAllStudent(data);
  
      const labels = data.map(student => student.fullname);
      const notes = data.map(student => Number(student.note) || 0); // Ensure numbers
      const niveaux = data.map(student => niveauMapping[student.proficiencyLevel] || 0); // Convert niveau
      const formations = data.map(student => student.formationsSuivies || []);

      setChartData({ labels, notes, niveaux, formations }); // Add formations to chart data
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch user data");
    }
  };
  
    useEffect(() => {
        fetchStudent();
      }, []);
  
  return (
    
      <>
      <ToastContainer/>
      <div class="w-full flex justify-center"> {/* Add this wrapper div */}
      <div class="bg-white rounded-lg shadow-sm p-4 md:p-6" style={{width:"800px",display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column"}}>
        <div class="w-full p-4">
          <h2 class="text-lg font-bold mb-4 text-center">Student Performance</h2>
          {/* Chart Section - only scrollable on small screens */}
          <div class="sm:overflow-x-auto sm:overflow-visible">
            <div class="min-w-[300px] w-full" style={{ height: "350px" }}>
              <BarChart
                xAxis={[{ id: 'students', data: chartData.labels, scaleType: 'band' }]}
                series={[
                  { id: 'niveau', data: chartData.niveaux, label: 'Niveau', color: '#fdc401' },
                ]}
                width={700}
                height={350}
              />
            </div>
          </div>
        </div>

        <div class="w-full p-4">
          {/* Table Section - only scrollable on small screens */}
          <div class="sm:overflow-x-auto sm:overflow-visible">
            <table class="w-full  sm:min-w-full text-left" style={{width:"800px",display:"flex",justifyContent:"center",alignItems:"center"}}>
              <thead>
                <tr class="bg-blue-900 text-white font-medium text-sm">
                  <th class="px-4 py-2 text-sm">Fullname</th>
                  <th class="px-4 py-2 text-sm">Email</th>
                  <th class="px-3 py-2 text-sm">Niveau</th>
                  <th class="px-5 py-2 text-sm">Formations</th>
                </tr>
              </thead>
              <tbody>
                {allStudent.map((student, index) => (
                  <tr key={index} class="bg-white font-medium text-sm text-blue-900 even:bg-gray-50">
                    <td class="px-4 py-2 text-sm">{student.fullname}</td>
                    <td class="px-4 py-2 text-sm truncate max-w-[120px] sm:max-w-none">{student.email}</td>
                    <td class="px-3 py-2 text-sm">{student.proficiencyLevel}</td>
                    <td class="px-5 py-2 text-sm">
                      {student.formationsSuivies && student.formationsSuivies.map((formation, i) => (
                        <div key={i} class="mb-1 last:mb-0">{formation.titleEn}</div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}

export default TeachersStudent
