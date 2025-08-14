import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './CategoryInfo.css';

const CategoryInfo = () => {
  const [tableData, setTableData] = useState([]);
  const { categoryName } = useParams();

  useEffect(() => {
    if (categoryName) {
      // Fetch data for the selected category
      fetch(`http://localhost:5301/api/data?category=${categoryName}`)
        .then((response) => response.json())
        .then((data) => setTableData(data))
        .catch((error) => console.error('Error fetching data:', error));
    }
  }, [categoryName]);

  return (
    <div className="category-info-container">
      <h2>{categoryName}</h2>
      {tableData.length > 0 && (
        <table>
          <thead>
            <tr>
              {Object.keys(tableData[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, i) => (
                  <td key={i}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CategoryInfo;
