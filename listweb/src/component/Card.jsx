import React from "react";

const Card = ({ website, onDelete }) => {
  return (

      <a href={website.link} target="_blank" rel="noopener noreferrer">
    <div className="card">
      <img src={website.image} alt={website.name} />
      <h3>{website.name}</h3>

      <button onClick={() => onDelete(website._id)}>Delete</button>
    </div>
    </a>
  );
};

export default Card;
