import React, { useState, useEffect } from 'react';
import './index.css'

function App() {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({
    firstName: '',
    lastName: '',
    age: '',
  });
  const [editStudent, setEditStudent] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [selectedCsvFile, setSelectedCsvFile] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/students') 
      .then((response) => response.json())
      .then((data) => setStudents(data))
      .catch((error) => console.error('Error fetching students:', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({
      ...newStudent,
      [name]: value,
    });
  };

  const addOrUpdateStudent = () => {
    if (editStudent) {
     
      fetch(`http://localhost:8080/api/students/${editStudent._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStudent),
      })
        .then((response) => response.json())
        .then((data) => {
          
          const updatedStudents = students.map((student) =>
            student._id === data._id ? data : student
          );
          setStudents(updatedStudents);
          setNewStudent({
            firstName: '',
            lastName: '',
            age: '',
          });
          setEditStudent(null); 
        })
        .catch((error) => console.error('Error updating student:', error));
    } else {
     
      fetch('http://localhost:8080/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStudent),
      })
        .then((response) => response.json())
        .then((data) => {
          setStudents([...students, data]);
          setNewStudent({
            firstName: '',
            lastName: '',
            age: '',
          });
        })
        .catch((error) => console.error('Error adding student:', error));
    }
  };

  const deleteStudent = (studentId) => {
   
    fetch(`http://localhost:8080/api/students/${studentId}`, {
      method: 'DELETE',
    })
      .then(() => {
        
        const updatedStudents = students.filter(
          (student) => student._id !== studentId
        );
        setStudents(updatedStudents);
      })
      .catch((error) => console.error('Error deleting student:', error));
  };

  const handleCsvFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedCsvFile(file);
  };

  const uploadCsvFile = () => {
    if (selectedCsvFile) {
      const formData = new FormData();
      formData.append('csvFile', selectedCsvFile);

      fetch('http://localhost:8080/api/uploadCsv', {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to upload CSV');
          }
          return response.json();
        })
        .then((data) => {
          if (Array.isArray(data)) {
            setCsvData(data);
          } else {
            console.error('Data received from the backend is not an array:', data);
          }

          setTimeout(() => {
            window.location.reload();
          }, 2000);
        })
        .catch((error) => console.error('Error uploading or processing CSV:', error));
    }
  };

  const editStudentData = (student) => {
    setEditStudent(student);
    setNewStudent(student); 
  };

  return (
    <div className="App">
      <header className="App-header text-center py-4 bg-blue-500">
        <h1 className="text-2xl font-semibold text-white">Student Dashboard</h1>
      </header>
      <main className="container mx-auto py-4">
        <div className="mb-4 p-4 bg-gray-100">
          <h2 className="text-xl font-semibold mb-2">
            {editStudent ? 'Edit Student' : 'Add Student'}
          </h2>
          <div className="flex flex-col space-y-2">
            <input
              type="text"
              name="firstName"
              value={newStudent.firstName}
              onChange={handleInputChange}
              placeholder="First Name"
              className="border rounded-lg px-3 py-2"
            />
            <input
              type="text"
              name="lastName"
              value={newStudent.lastName}
              onChange={handleInputChange}
              placeholder="Last Name"
              className="border rounded-lg px-3 py-2"
            />
            <input
              type="number"
              name="age"
              value={newStudent.age}
              onChange={handleInputChange}
              placeholder="Age"
              className="border rounded-lg px-3 py-2"
            />
            <button
              onClick={addOrUpdateStudent}
              className="bg-blue-500 text-white hover:bg-blue-600 rounded-lg px-4 py-2"
            >
              {editStudent ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
        <div className="mb-4 p-4 bg-gray-100">
          <h2 className="text-xl font-semibold mb-2">Upload CSV</h2>
          <div className="flex space-x-2">
            <input
              type="file"
              accept=".csv"
              onChange={handleCsvFileChange}
              className="border rounded-lg px-3 py-2 flex-grow"
            />
            <button
              onClick={uploadCsvFile}
              className="bg-blue-500 text-white hover:bg-blue-600 rounded-lg px-4 py-2"
            >
              Upload
            </button>
          </div>
        </div>
        <div className="p-4 bg-gray-100">
          <h2 className="text-xl font-semibold mb-2">Student List</h2>
          <ul>
            {students.map((student) => (
              <li key={student._id} className="mb-2">
                <div className="flex justify-between">
                  <div>
                    {student.firstName} {student.lastName}, Age: {student.age}
                  </div>
                  <div>
                    <button
                      onClick={() => editStudentData(student)}
                      className="bg-blue-500 text-white hover:bg-blue-600 rounded-lg px-2 py-1 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteStudent(student._id)}
                      className="bg-red-500 text-white hover:bg-red-600 rounded-lg px-2 py-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}

export default App;
