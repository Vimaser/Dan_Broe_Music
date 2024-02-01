import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import "./css/Header.css";

const Header = ({ hasNewMessages }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const auth = getAuth();
  const [user] = useAuthState(auth);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header>
      {user && hasNewMessages && <div className="notification-bell">Messages!</div>}
      <nav className={isMenuOpen ? "open" : ""}>
        <div className="hamburger" onClick={handleMenuToggle}>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="menu-items">
          <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/music" onClick={() => setIsMenuOpen(false)}>Music</Link>
          <Link to="/events" onClick={() => setIsMenuOpen(false)}>Events</Link>
          <Link to="/gallery" onClick={() => setIsMenuOpen(false)}>Gallery</Link>
          <Link to="/about" onClick={() => setIsMenuOpen(false)}>About</Link>
          <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
