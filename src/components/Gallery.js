import React, { useEffect, useState } from "react";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { app } from "../firebase";
/* import LazyLoad from 'react-lazyload'; */
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
        const galleryRef = ref(storage, 'gallery/');
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

  useEffect(() => {
    // Attach event listener to close the modal when clicking outside the modal
    const handleOutsideClick = (event) => {
      if (isModalOpen && event.target.classList.contains("modal-overlay")) {
        closeModal();
      }
    };

    window.addEventListener("click", handleOutsideClick);

    // Cleanup event listener when the component unmounts
    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [isModalOpen]);

  useEffect(() => {
    // Attach event listener to close the modal when clicking on the image
    const modalImage = document.querySelector(".modal-image");
    const handleImageClick = () => {
      closeModal();
    };

    if (modalImage) {
      modalImage.addEventListener("click", handleImageClick);
    }

    // Cleanup event listener when the component unmounts or when the modal closes
    return () => {
      if (modalImage) {
        modalImage.removeEventListener("click", handleImageClick);
      }
    };
  }, [isModalOpen]);

  if (loading) return <div className="gallery-container">Loading...</div>;
  if (error) return <div className="gallery-container">{error}</div>;

  return (
    <div className="gallery-container">
      <section className="gallery-header">
        <h1>Gallery</h1>
      </section>
      <section className="gallery-content">
        {images.map((image, index) => (
          <figure key={index} className="gallery-item" onClick={() => {
            setSelectedImage(image);
            setIsModalOpen(true);
          }}>
            <img
              src={image.url}
              alt={image.title || `Gallery item ${index + 1}`}
              loading="lazy"
            />
            {image.title && <figcaption>{image.title}</figcaption>}
          </figure>
        ))}
      </section>
      {isModalOpen && selectedImage && (
        <div className="modal-overlay" role="dialog" aria-label="Image Modal">
          <div className="modal">
            <img
              className="modal-image"
              src={selectedImage.url}
              alt={selectedImage.title || `Gallery item`}
            />
            <span className="modal-close" onClick={closeModal} aria-label="Close">
              ×
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;