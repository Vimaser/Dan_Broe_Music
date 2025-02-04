import React, { useEffect, useState } from "react";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { app } from "../firebase";
import Footer from "./Footer";
import img from "../img/zhome2.gif";
import "./css/Gallery.css";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const storage = getStorage(app);
        const galleryRef = ref(storage, "gallery/");
        const result = await listAll(galleryRef);

        const galleryImageUrls = await Promise.all(
          result.items.map(async (itemRef) => {
            try {
              const url = await getDownloadURL(itemRef);
              return { url, title: "" };
            } catch (error) {
              console.error("Error fetching individual image URL:", error);
              return null;
            }
          })
        );

        setImages(galleryImageUrls.filter(Boolean));
      } catch (error) {
        console.error("Error fetching images:", error);
        setError("Failed to fetch images.");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="gallery-container">
      <section className="gallery-header">
        <h1>Gallery</h1>
      </section>
      
      <section className="gallery-content">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : images.length ? (
          images.map((image, index) => (
            <figure
              key={index}
              className="gallery-item"
              onClick={() => {
                setSelectedImage(image);
                setIsModalOpen(true);
              }}
            >
              <img
                src={image.url}
                alt={image.title || `Gallery item ${index + 1}`}
                loading="lazy"
              />
              {image.title && <figcaption>{image.title}</figcaption>}
            </figure>
          ))
        ) : (
          <p>No images available.</p>
        )}
      </section>

      {isModalOpen && selectedImage && (
        <div className="modal-overlay" role="dialog" aria-label="Image Modal">
          <div className="modal">
            <img
              className="modal-image"
              src={selectedImage.url}
              alt={selectedImage.title || "Gallery item"}
            />
            <span
              className="modal-close"
              onClick={closeModal}
              aria-label="Close"
            >
              ×
            </span>
          </div>
        </div>
      )}

      <br />
      <section className="image-section-gal">
        <img src={img} alt="Dan Broe" />
      </section>
      <br />

      <Footer />
    </div>
  );
};

export default Gallery;
