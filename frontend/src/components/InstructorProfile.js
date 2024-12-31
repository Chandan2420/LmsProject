import React, { useState } from "react";
import axios from "axios";
import "./InstructorProfile.css";

const InstructorProfile = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    institution: "",
    specialization: "",
    experience: "",
    biography: "", 
    linkedin: "",
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleButtonClick = () => {
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Prepare FormData for the API request
    const data = new FormData();
    
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    if (profilePicture) {
      data.append("profilePicture", profilePicture);
    }

    try {
      const response = await axios.post("http://localhost:5000/api/InstructorProfile", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccessMessage(response.data.message);
      setErrorMessage("");
     // setShowForm(false); // Hide the form after a successful submission
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        institution: "",
        specialization: "",
        experience: "",
        biography: "",
        linkedin: "",
      });
      setProfilePicture(null);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || "Failed to create instructor profile."
      );
      setSuccessMessage("");
    }
  };

  return (
    <div className="main-container">
    <div style={{ padding: "20px" }}>
      {!showForm && (
        <button
          onClick={handleButtonClick}
          style={{
            padding: "20px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Become an Instructor
        </button>
      )}

      {showForm && (
        <div style={{ marginTop: "20px" }}>
          <h2>Instructor Profile Form</h2>
          <form className="instructor-form" onSubmit={handleFormSubmit}>
            <label>
              Full Name
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </label>
            <br />
            <label>
              Email
              <input
                type="email"
                name="email"
                
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </label>
            <br />
            <label>
              Phone Number
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </label>
            <br />
            <label>
              Profile Picture
              <input type="file" name="profilePicture" onChange={handleFileChange} />
            </label>
            <br />
            <label>
              Institution/Organization
              <input
                type="text"
                name="institution"
                value={formData.institution}
                onChange={handleInputChange}
              />
            </label>
            <br />
            <label>
              Specialization/Subjects
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
              />
            </label>
            <br />
            <label>
              Experience (in years)
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
              />
            </label>
            <br />
            <label>
              About Me
              <textarea
                name="biography"
                rows="4"
                value={formData.biography}
                onChange={handleInputChange}
              />
            </label>
            <br />
            <label>
              LinkedIn Profile
              
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleInputChange}
              />
            </label>
            <br />
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }} > Submit </button>
          </form>

          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </div>
      )}
    </div>
    </div>
  );
};

export default InstructorProfile;
