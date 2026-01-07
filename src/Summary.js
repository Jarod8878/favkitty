import React, { useState } from "react";

function Summary({ total, likedCats, skippedCats, restart }) {
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (url) => {
    setSelectedImage(url);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="summary-container text-center">
      <h2>Summary</h2>
      <p>Total cats seen: {total}</p>
      <p>Liked: {likedCats.length}</p>
      <p>Skipped: {skippedCats.length}</p>

      <div className="d-flex flex-wrap justify-content-center">
        {likedCats.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`Liked cat ${index + 1}`}
            className="summary-cat-image m-2"
            onClick={() => openModal(url)}
          />
        ))}
      </div>

      <button className="btn btn-primary mt-3" onClick={restart}>
        Restart
      </button>

      {selectedImage && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              ×
            </button>
            <img
              src={selectedImage}
              alt="Full size cat"
              className="modal-image"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Summary;