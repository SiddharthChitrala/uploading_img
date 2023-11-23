import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [image, setImage] = useState(null);
  const [allImage, setAllImage] = useState(null);

  useEffect(() => {
    getImage();
  }, []);

  const onInputChange = (e) => {
    setImage(e.target.files[0]);
  };

  const submitImage = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", image);

    try {
      const result = await axios.post(
        "http://localhost:9000/upload-image",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Handle successful upload
      console.log("Upload successful:", result.data);
      window.alert("Upload successful!");

      // After successful upload, fetch updated image list
      getImage();
    } catch (error) {
      // Handle upload error
      console.error("Upload error:", error.message);
      window.alert("Upload failed. Please try again.");
    }
  };

  const getImage = async () => {
    try {
      const result = await axios.get("http://localhost:9000/get-image");
      console.log(result.data.data); // Check the received data from the server
  
      // Verify if the data received contains the expected image information
      setAllImage(result.data.data);
    } catch (error) {
      console.error("Error fetching images:", error.message);
      // Handle error fetching images here
    }
  };
  

  return (
    <div className="container-fluid">
      <div className="container">
        <form onSubmit={submitImage}>
          <input type="file" accept="image/*" onChange={onInputChange} />
          <button type="submit">Submit</button>
        </form>
      </div>

      <div className="container">
        {allImage ? (
          allImage.map((data, index) => (
            <img
              key={index}
              src={`http://localhost:9000/images/${data.image}`}
              alt={`Description ${index}`} // Update alt attribute here
              height={100}
              width={100}
            />
          ))
        ) : (
          <p>Loading images...</p>
        )}
      </div>

    </div>
  );
}

export default App;
