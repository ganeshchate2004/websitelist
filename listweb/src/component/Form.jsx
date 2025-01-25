import React, { useState } from "react";

const Form = ({ onAddWebsite }) => {
  const [websiteName, setWebsiteName] = useState("");
  const [websiteLink, setWebsiteLink] = useState("");
  const [websiteImage, setWebsiteImage] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!websiteName.trim() || !websiteLink.trim() || !websiteImage.trim()) {
      alert("Please enter the website name, link, and image URL!");
      return;
    }

    // Trigger parent function to add website
    onAddWebsite({
      name: websiteName.trim(),
      link: websiteLink.trim(),
      image: websiteImage.trim(),
    });

    // Clear input fields
    setWebsiteName("");
    setWebsiteLink("");
    setWebsiteImage("");
  };

  return (
    <form onSubmit={handleFormSubmit} className="form-container">
      <h2>Add Website</h2>
      <label>
        Website Name:
        <input
          type="text"
          value={websiteName}
          onChange={(e) => setWebsiteName(e.target.value)}
          placeholder="Enter website name"
        />
      </label>
      <label>
        Website Link:
        <input
          type="url"
          value={websiteLink}
          onChange={(e) => setWebsiteLink(e.target.value)}
          placeholder="Enter website link"
        />
      </label>
      <label>
        Image URL:
        <input
          type="url"
          value={websiteImage}
          onChange={(e) => setWebsiteImage(e.target.value)}
          placeholder="Enter website image URL"
        />
      </label>
      <button type="submit">Add Website</button>
    </form>
  );
};

export default Form;
