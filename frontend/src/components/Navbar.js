import React from 'react';

const Navbar = ({ activeCategory, onCategoryChange, onLogout }) => {
  const categories = ['For You', 'Featured', 'Events'];

  return (
    <nav className="navbar navbar-expand-sm navbar-dark bg-dark sticky-top">
      <div className="container-fluid">
        <span className="navbar-brand">BlinkWall</span>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-sm-0">
            {categories.map((category) => (
              <li className="nav-item" key={category}>
                <button
                  className={`nav-link btn btn-link ${
                    activeCategory === category ? 'active' : ''
                  }`}
                  onClick={() => onCategoryChange(category)}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
          <ul className="navbar-nav">
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={onLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;