import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Employee = () => {
  const [employee, setEmployee] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate()
  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/employee")
      .then((result) => {
        console.log("employee fetched:", result.data);
        if (result.data.Status) {
          setEmployee(result.data.Data);
        } else {
          console.error("Error fetching employee:", result.data.Error);
          setError(result.data.Error);
        }
      })
      .catch((err) => {
        console.log("Axios error:", err);
        setError("Failed to fetch employee. Please try again later.");
      });
  }, []);
  const handleDelete = (id) => {
    axios.delete('http://localhost:3000/auth/delete_employee/'+id)
    .then((result => {
      if(result.data.Status){
        window.location.reload()
      } else {
        alert(result.data.Error)
      }
    }))
  }
  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>Employee List</h3>
      </div>
      <Link to="/dashboard/add_employee" className="btn btn-success">
        Add Employee
      </Link>
      <div className="mt-3">
        {error && <p className="text-danger">{error}</p>}
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Adress</th>
              <th>Salary</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employee.map((employee, index) => (
              <tr key={index}>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.adress}</td>
                <td>{employee.salary}</td>
                <td>
                  <Link
                    to={"/dashboard/edit_employee/" + employee.id}
                    className="btn btn-info btn-sm me-2"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleDelete(employee.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Employee;
