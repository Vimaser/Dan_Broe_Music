import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "../firebase";
import Footer from "./Footer";
import loadingGif from "../img/loading2.gif";
import img from "../img/zhome2.gif";
import "./css/Events.css";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  function toStandardTime(militaryTime) {
    if (!militaryTime) {
      return "Time not set";
    }

    const [hours, minutes] = militaryTime.split(":");
    const hoursInt = parseInt(hours, 10);
    const suffix = hoursInt >= 12 ? "PM" : "AM";
    const standardHours = ((hoursInt + 11) % 12) + 1;
    return `${standardHours.toString().padStart(2, "0")}:${minutes} ${suffix}`;
  }

  useEffect(() => {
    const fetchEvents = async () => {
      const db = getFirestore(app);
      const eventsCollection = collection(db, "Events");
      const eventSnapshot = await getDocs(eventsCollection);
      const eventsList = eventSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setEvents(eventsList);
      setIsLoading(false);
    };

    fetchEvents();
  }, []);

  if (isLoading) {
    return (
      <div className="events-background">
        <img src={loadingGif} alt="Loading..." />
        <br />
        <Footer />
      </div>
    );
  }

  const timeStyle = {
    color: "#fff",
    backgroundColor: "#000",
    padding: "5px 10px",
    borderRadius: "5px",
    fontFamily: "Digital, Arial, sans-serif",
    fontSize: "1.5rem",
    display: "inline-block",
    margin: "0 5px",
  };

  const labelStyle = {
    color: "#fff",
    fontWeight: "bold",
  };

  const timeContainerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  };

  return (
    <div className="events-background">
      <section>
        <h1>Upcoming Events</h1>
      </section>
      <section>
        {events.length ? (
          events.map((event) => (
            <article key={event.id}>
              <h2>{event.eventName}</h2>
              <p>{event.eventDate || "Date not set"}</p>
              <div style={timeContainerStyle}>
                <p style={labelStyle}>Starting Time: </p>
                <p style={timeStyle}>
                  {event.eventTime
                    ? toStandardTime(event.eventTime)
                    : "Time not set"}
                </p>
              </div>
              <div style={timeContainerStyle}>
                <p style={labelStyle}>Ending Time:</p>
                <p style={timeStyle}>
                  {event.eventEndingTime
                    ? toStandardTime(event.eventEndingTime)
                    : "Time not set"}
                </p>
              </div>
              <p>{event.location}</p>
            </article>
          ))
        ) : (
          <p>No upcoming events.</p>
        )}
      </section>
      <br />
      <section className="image-section">
        <img src={img} alt="Dan Broe" />
      </section>
      <br />
      <Footer />
    </div>
  );
};

export default Events;
