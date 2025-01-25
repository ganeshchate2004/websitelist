import React, { useState, useEffect } from "react";
import Form from "./Form";
import CardList from "./CardList";
import "./addwebsite.css";

const AddWebsite = () => {
  const [websites, setWebsites] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showSignupForm, setShowSignupForm] = useState(false);

  // Fetch websites for authenticated user
  useEffect(() => {
    if (isAuthenticated) {
      const fetchWebsites = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch("http://localhost:5000/user-websites", {
            headers: {
              Authorization: token,
            },
          });
          const data = await response.json();
          setWebsites(data);
        } catch (error) {
          console.error("Error fetching websites:", error);
        }
      };
      fetchWebsites();
    }
  }, [isAuthenticated]);

  // Handle signup
  const handleSignup = async (name, email, password) => {
    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Signup successful! Please log in.");
        setShowSignupForm(false);
      } else {
        alert(result.error || "Signup failed!");
      }
    } catch (error) {
      console.error("Error signing up:", error);
      alert("Failed to sign up. Please try again.");
    }
  };

  // Handle login
  const handleLogin = async (email, password) => {
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      if (response.ok) {
        setIsAuthenticated(true);
        setUserData(result.user); // Assuming backend sends user data
        localStorage.setItem("token", result.token); // Save token
      } else {
        alert(result.error || "Login failed!");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Failed to log in. Please try again.");
    }
  };

  // Add a new website
  const addWebsite = async (newWebsite) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/add-website", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(newWebsite),
      });

      const result = await response.json();
      if (response.ok) {
        setWebsites([...websites, result.website]);
        setShowForm(false);
      } else {
        alert(result.error || "Error adding website!");
      }
    } catch (error) {
      console.error("Error adding website:", error);
      alert("Failed to add the website. Please try again.");
    }
  };

  // Delete a website by ID
  const deleteWebsite = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/delete-website/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      });

      const result = await response.json();
      if (response.ok) {
        setWebsites(websites.filter((website) => website._id !== id));
      } else {
        alert(result.error || "Error deleting website!");
      }
    } catch (error) {
      console.error("Error deleting website:", error);
      alert("Failed to delete the website. Please try again.");
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserData(null);
    localStorage.removeItem("token");
  };

  return (
    <div className="container">
      {!isAuthenticated ? (
        <div>
          <h1>{showSignupForm ? "Sign Up" : "Login"}</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const name = e.target.name?.value;
              const email = e.target.email.value;
              const password = e.target.password.value;

              if (showSignupForm) {
                handleSignup(name, email, password);
              } else {
                handleLogin(email, password);
              }
            }}
          >
            {showSignupForm && <input type="text" name="name" placeholder="Name" required />}
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">{showSignupForm ? "Sign Up" : "Login"}</button>
          </form>
          <button onClick={() => setShowSignupForm(!showSignupForm)}>
            {showSignupForm ? "Switch to Login" : "Switch to Sign Up"}
          </button>
        </div>
      ) : (
        <div>
          <h1>Welcome, {userData?.name || "User"}!</h1>
          <button onClick={logout}>Logout</button>
          <button className="toggle-form-btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Hide Form" : "Add Website"}
          </button>
          {showForm && <Form onAddWebsite={addWebsite} />}
          <CardList websites={websites} onDeleteWebsite={deleteWebsite} />
        </div>
      )}
    </div>
  );
};

export default AddWebsite;
