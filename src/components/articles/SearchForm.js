 
// src/components/articles/SearchForm.js
import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';

const SearchForm = ({ onSearch, initialValues = {}, categories = [] }) => {
  const [formData, setFormData] = useState({
    search: initialValues.search || '',
    category: initialValues.category || '',
    featured: initialValues.featured || false,
    sortBy: initialValues.sortBy || 'publishedAt',
    order: initialValues.order || 'desc'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(formData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <h3 className="form-title">
        <Filter size={18} />
        Search & Filter
      </h3>
      
      <div className="form-group">
        <input
          type="text"
          name="search"
          value={formData.search}
          onChange={handleChange}
          placeholder="Search articles..."
          className="search-input"
        />
      </div>

      <div className="form-group">
        <label>Category</label>
        <select name="category" value={formData.category} onChange={handleChange}>
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.name} value={cat.name}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
          />
          Featured only
        </label>
      </div>

      <button type="submit" className="search-btn">
        <Search size={16} />
        Search
      </button>
    </form>
  );
};

export default SearchForm;