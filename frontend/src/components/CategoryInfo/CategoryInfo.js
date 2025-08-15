import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CategoryInfo.css';

const CategoryInfo = () => {
  const [tableData, setTableData] = useState([]);
  const { categoryName } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (categoryName) {
      // Fetch data for the selected category
      fetch(`http://localhost:5301/api/data?category=${categoryName}`)
        .then((response) => response.json())
        .then((data) => setTableData(data))
        .catch((error) => console.error('Error fetching data:', error));
    }
  }, [categoryName]);

  const handleApply = (cardName) => {
    navigate('/apply', { state: { cardName } });
  };

  return (
    <div className="container">
      <div className="category-info-container">
        <div className="category-info-header">
          <h2>{categoryName} Credit Cards</h2>
        </div>
        <div className="card-grid">
          {tableData.map((card, index) => (
            <div key={index} className="credit-card">
              <h3>{card['Card Name']}</h3>
              <p><strong>Bank:</strong> {card.Bank}</p>
              <p><strong>Rewards Rate:</strong> {card['Rewards Rate']}</p>
              <p><strong>Annual Fee:</strong> {card['Annual Fee']}</p>
              <button className="apply-button" onClick={() => handleApply(card['Card Name'])}>
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryInfo;
