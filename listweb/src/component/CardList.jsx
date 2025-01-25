import React from "react";
import Card from "./Card";


const CardList = ({ websites, onDeleteWebsite }) => {
  return (
    <div className="card-list">
      {websites.map((website) => (
        <Card key={website._id} website={website} onDelete={onDeleteWebsite} />
      ))}
    </div>
  );
};

export default CardList;
