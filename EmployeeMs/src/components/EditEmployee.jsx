import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    salary: "",
    adress: "",
    category_id: "",
  });

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch categories
    axios.get('http://localhost:3000/auth/category')
      .then(result => {
        if (result.data.Status) {
          setCategories(result.data.Data);
        } else {
          console.error("Error fetching categories:", result.data.Error);
          setError(result.data.Error);
        }
      })
      .catch(err => {
        console.log("Axios error:", err);
        setError("Failed to fetch categories. Please try again later.");
      });

    // Fetch employee data
    axios.get(`http://localhost:3000/auth/employee/${id}`)
      .then(result => {
        if (result.data.Status && result.data.Data && result.data.Data.length > 0) {
          const employeeData = result.data.Data[0];
          console.log("Fetched employee data:", employeeData); // Log the fetched data
          setEmployee({
            name: employeeData.name,
            email: employeeData.email,
            salary: employeeData.salary,
            adress: employeeData.adress,
            category_id: employeeData.category_id,
          });
        } else {
          console.error("Error fetching employee or employee not found:", result.data.Error);
          setError(result.data.Error || "Employee not found");
        }
      })
      .catch(err => {
        console.log("Axios error:", err);
        setError("Failed to fetch employee data. Please try again later.");
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:3000/auth/edit_employee/${id}`, employee)
      .then(result => {
        if(result.data.status) {
          navigate('/dashboard/employee')
        } else {
          alert(result.data.error)
        }
      })
      .catch(err => {
        console.log("Axios error:", err);
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Edit Employee</h3>
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label htmlFor="inputName" className="form-label">Name</label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputName"
              placeholder="Enter Name"
              value={employee.name}
              onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
              required
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputEmail4" className="form-label">Email</label>
            <input
              type="email"
              className="form-control rounded-0"
              id="inputEmail4"
              placeholder="Enter Email"
              autoComplete="off"
              value={employee.email}
              onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
              required
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputSalary" className="form-label">Salary</label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputSalary"
              placeholder="Enter Salary"
              autoComplete="off"
              value={employee.salary}
              onChange={(e) => setEmployee({ ...employee, salary: e.target.value })}
              required
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputAdress" className="form-label">Address</label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputAdress"
              placeholder="1234 Main St"
              autoComplete="off"
              value={employee.adress}
              onChange={(e) => setEmployee({ ...employee, adress: e.target.value })}
              required
            />
          </div>
          <div className="col-12">
            <label htmlFor="categories" className="form-label">Category</label>
            <select
              name="categories"
              id="categories"
              className="form-select"
              value={employee.category_id}
              onChange={(e) => setEmployee({ ...employee, category_id: e.target.value })}
              required
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;
