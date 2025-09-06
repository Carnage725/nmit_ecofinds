import React from "react";

function Card({ title, description, image }) {
  return (
    <div className="card">
      <img src={image} alt={title} className="card-image" loading="lazy" decoding="async" />
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

export default Card;
