import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { app } from "./firebase";
import "./App.css";
import {
  Home,
  Header,
  About,
  Music,
  Gallery,
  Contact,
  Admin,
  Login,
  Events,
} from "./components";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const AppContent = () => {
  // const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [messages, setMessages] = useState([]);
  const auth = getAuth();
  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const messagesCollection = collection(db, "Messages");
    const unsubscribe = onSnapshot(messagesCollection, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      })).filter(message => message.isNew);
      setMessages(newMessages);
    });

    return () => unsubscribe(); // Clean up the listener
  }, [db]);

  return (
    <>
      <Header hasNewMessages={messages.some(message => message.isNew)} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/music" element={<Music />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/events" element={<Events />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            isAuthenticated ? <Admin messages={messages} setMessages={setMessages} /> : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
