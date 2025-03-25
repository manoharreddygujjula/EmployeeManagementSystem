import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddCategory = () => {
  const [category, setCategory] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3000/auth/add_category', { category })
      .then(result => {
        if (result.data.Status) {
          navigate('/dashboard/categories');
        } else {
          console.error("Error adding category:", result.data.Error);
          setError(result.data.Error);
        }
      })
      .catch(err => {
        console.log("Axios error:", err);
        setError("Failed to add category. Please try again later.");
      });
  };

  return (
    <div className='container'>
      <h2>Add Category</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="categoryName">Category Name</label>
          <input
            type="text"
            className="form-control"
            id="categoryName"
            placeholder="Enter category name"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-danger">{error}</p>}
        <button type="submit" className="btn btn-primary">Add Category</button>
      </form>
    </div>
  );
};

export default AddCategory;
