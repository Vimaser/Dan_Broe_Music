import React from "react";
import { Link } from "react-router-dom";
import "./css/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p>© 2023 Dan Broe Music</p>
      <div className="social-links-container">
        <div className="social-links-1">
          <a
            className="social-link"
            href="https://www.facebook.com/daniel.broe.1"
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook
          </a>

        
{/*           
          // Will updated once all of clients social media is available
          <a
            className="social-link"
            href=""
            target="_blank"
            rel="noopener noreferrer"
          >
            Bandcamp
          </a>
          <a
            className="social-link"
            href=""
            target="_blank"
            rel="noopener noreferrer"
          >
            X / Twitter
          </a>
        </div>
        <div className="social-links-2">
          <a
            className="social-link"
            href=""
            target="_blank"
            rel="noopener noreferrer"
          >
            YouTube
          </a>
          <a
            className="social-link"
            href=""
            target="_blank"
            rel="noopener noreferrer"
          >
            ReverbNation
          </a> */}
          <Link to="/Admin" className="social-link">
            AdminPortal
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;