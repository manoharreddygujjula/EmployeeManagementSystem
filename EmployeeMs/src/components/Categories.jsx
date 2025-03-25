import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3000/auth/category')
      .then(result => {
        console.log("Categories fetched:", result.data);
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
  }, []);

  return (
    <div className='px-5 mt-3'>
      <div className='d-flex justify-content-center'>
        <h3>Category List</h3>
      </div>
      <Link to="/dashboard/add_category" className='btn btn-success'>Add Category</Link>
      <div className='mt-3'>
        {error && <p className="text-danger">{error}</p>}
        <table className='table'>
          <thead>
            <tr>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={index}>
                <td>{category.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Categories;
