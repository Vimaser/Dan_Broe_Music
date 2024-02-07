import React, { useState, useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { app } from "../firebase";
import "./css/Admin.css";

const Admin = () => {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventEndingTime, setEventEndingTime] = useState("");
  const [location, setLocation] = useState("");
  const [events, setEvents] = useState([]);
  const [image, setImage] = useState(null);
  const [imageTitle, setImageTitle] = useState("");
  const [musicTitle, setMusicTitle] = useState("");
  const [musicArtist, setMusicArtist] = useState("");
  const [gallery, setGallery] = useState([]);
  const [musicList, setMusicList] = useState([]);
  const [musicURL, setMusicURL] = useState("");
  const [musicReleaseDate, setMusicReleaseDate] = useState("");
  const [messages, setMessages] = useState([]);
  // const [newEmail, setNewEmail] = useState("");
  // const [newPassword, setNewPassword] = useState("");
  //  const [featuredSongURL, setFeaturedSongURL] = useState("");
  //  const [featuredSongTitle, setFeaturedSongTitle] = useState("");
  //  const [featuredSongArtist, setFeaturedSongArtist] = useState("");
  //  const [newsTitle, setNewsTitle] = useState("");
  //  const [newsContent, setNewsContent] = useState("");
  //  const [newsDate, setNewsDate] = useState("");
  //  const [loading, setLoading] = useState(false);
  //  const [error, setError] = useState(null);
  //  const [newsItems, setNewsItems] = useState([]);
  const db = getFirestore();
  const MAX_IMAGES = 20;

  //  const handleTitleChange = (e) => setNewsTitle(e.target.value);
  //  const handleContentChange = (e) => setNewsContent(e.target.value);
  //  const handleDateChange = (e) => setNewsDate(e.target.value);

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore(app);
      const messagesCollection = collection(db, "Messages");
      const messagesSnapshot = await getDocs(messagesCollection);
      const messagesList = messagesSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMessages(messagesList);
    };

    fetchData();
  }, []);

  const handleDeleteMessage = async (messageId) => {
    const db = getFirestore();
    const messageRef = doc(db, "Messages", messageId);
    try {
      await deleteDoc(messageRef);
      console.log("Document successfully deleted!");
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleOpenMessages = async () => {
    // Loop through each message and update its isNew field to false
    for (const message of messages) {
      const messageRef = doc(db, "Messages", message.id);
      try {
        await updateDoc(messageRef, {
          isNew: false,
        });
      } catch (error) {
        console.error("Error updating message: ", error);
      }
    }
  };

  const handleMusicUpload = async () => {
    try {
      const db = getFirestore(app);
      const musicCollection = collection(db, "Music");
      await addDoc(musicCollection, {
        title: musicTitle,
        artist: musicArtist,
        url: musicURL,
        releaseDate: new Date(musicReleaseDate),
      });

      setMusicTitle("");
      setMusicArtist("");
      setMusicURL("");
      setMusicReleaseDate("");
    } catch (error) {
      console.error("Error uploading music:", error);
    }
  };

  const handleDeleteMusic = async (id) => {
    try {
      const db = getFirestore(app);
      await deleteDoc(doc(db, "Music", id));
      setMusicList((musicList) => musicList.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting music:", error);
    }
  };

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
    };

    fetchEvents();

    const fetchGalleryAndMusic = async () => {
      const db = getFirestore(app);
      // Gallery
      const galleryCollection = collection(db, "Gallery");
      const gallerySnapshot = await getDocs(galleryCollection);
      setGallery(
        gallerySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
      // Music
      const musicCollection = collection(db, "Music");
      const musicSnapshot = await getDocs(musicCollection);
      setMusicList(
        musicSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    };

    fetchGalleryAndMusic();
  }, []);

  const handleAddEvent = async () => {
    try {
      const db = getFirestore(app);
      const eventsCollection = collection(db, "Events");

      // Construct a date object using the eventDate and set the time to the middle of the day.
      const dateWithCorrectTimeZone = new Date(eventDate + "T12:00:00");

      await addDoc(eventsCollection, {
        eventName,
        // Save the date with the correct time zone.
        eventDate: dateWithCorrectTimeZone,
        location,
        eventTime,
        eventEndingTime,
      });

      // Reset form fields
      setEventName("");
      setEventDate("");
      setLocation("");
      setEventTime("");
      setEventEndingTime("");

      // Fetch events again to update the list
      fetchEvents();
    } catch (error) {
      console.error("Error adding event: ", error);
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      const db = getFirestore(app);
      await deleteDoc(doc(db, "Events", id));

      fetchEvents();
    } catch (error) {
      console.error("Error deleting event: ", error);
    }
  };

  const fetchEvents = async () => {
    const db = getFirestore(app);
    const eventsCollection = collection(db, "Events");
    const eventsSnapshot = await getDocs(eventsCollection);
    const eventsList = eventsSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setEvents(eventsList);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleImageUpload = async () => {
    if (gallery.length >= MAX_IMAGES) {
      alert(`You cannot upload more than ${MAX_IMAGES} images.`);
      return;
    }

    try {
      const storageRef = ref(getStorage(app), "gallery/" + image.name);
      await uploadBytes(storageRef, image);
      const downloadURL = await getDownloadURL(storageRef);

      const db = getFirestore(app);
      const galleryCollection = collection(db, "Gallery");
      const docRef = await addDoc(galleryCollection, {
        title: imageTitle,
        url: downloadURL,
      });

      setImage(null);
      setImageTitle("");

      setGallery((prevGallery) => [
        ...prevGallery,
        {
          id: docRef.id,
          title: imageTitle,
          url: downloadURL,
        },
      ]);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleDeleteImage = async (image) => {
    try {
      console.log("Deleting image:", image);

      let fileName = image.fileName;
      if (!fileName) {
        console.warn(
          "Warning: image.fileName is undefined, extracting fileName from URL"
        );
        const urlParts = image.url.split("/");
        fileName = decodeURIComponent(
          urlParts[urlParts.length - 1].split("?")[0]
        );
      }

      const pathPrefix = "gallery/";
      if (!fileName.startsWith(pathPrefix)) {
        fileName = pathPrefix + fileName;
      }

      const storageRef = ref(getStorage(app), fileName);
      console.log("Full Path:", storageRef.fullPath);

      try {
        await deleteObject(storageRef);
      } catch (error) {
        console.error("Error deleting from Firebase Storage:", error);
      }

      const db = getFirestore(app);
      await deleteDoc(doc(db, "Gallery", image.id));

      setGallery(gallery.filter((item) => item.id !== image.id));
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

/*   const handleChangeEmail = async (newEmail) => {
    const auth = getAuth();
    const user = auth.currentUser;

    try {
      await updateEmail(user, newEmail);
      alert("Email updated successfully");
      console.log("Email updated successfully");
      // Update email in state or notify user of success
    } catch (error) {
      console.error("Error updating email:", error);
      alert("Error updating email:", error);
      // Handle errors (e.g., email already in use, invalid email, etc.)
    }
  }; */

/*   const handleChangePassword = async (newPassword) => {
    const auth = getAuth();
    const user = auth.currentUser;

    try {
      await updatePassword(user, newPassword);
      alert("Password updated successfully");
      console.log("Password updated successfully");
      // Update state or notify user of success
    } catch (error) {
        alert("Error updating password:", error);
      console.error("Error updating password:", error);
      // Handle errors (e.g., weak password, user needs re-authentication, etc.)
    }
  }; */

  const handleLogout = async () => {
    try {
      const authInstance = getAuth(app);
      await signOut(authInstance);
      console.log("User signed out");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  /*  const handleUpdateFeaturedSong = async () => {
    const db = getFirestore(app);
    const featuredSongRef = doc(db, "featuredSong", "1yDHsIYnMjuowB5HpP3k");
    try {
      await updateDoc(featuredSongRef, {
        url: featuredSongURL,
        title: featuredSongTitle,
        artist: featuredSongArtist,
      });
      console.log("Featured Song Updated");
    } catch (error) {
      console.error("Error updating featured song: ", error);
    }
  }; */

  /*   const handleAddNews = async () => {
    if (!newsTitle || !newsContent || !newsDate) {
      setError("All fields are required");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const db = getFirestore(app);
      const newsRef = collection(db, "news");
      await addDoc(newsRef, {
        title: newsTitle,
        content: newsContent,
        date: new Date(newsDate),
      });
      setNewsTitle("");
      setNewsContent("");
      setNewsDate("");
      alert("News added successfully");
    } catch (error) {
      console.error("Error adding news: ", error);
      setError("Error adding news");
    }
    setLoading(false);
  }; */

  useEffect(() => {
    const messagesCollection = collection(db, "Messages");

    const unsubscribe = onSnapshot(messagesCollection, (snapshot) => {
      const newMessages = snapshot.docs
        .map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
        .filter((message) => message.isNew);

      setMessages(newMessages);
    });

    return () => unsubscribe(); // Clean up the listener
  }, [db]);

  /*   useEffect(() => {
    const fetchNewsItems = async () => {
      const newsRef = collection(db, "news");
      const newsSnapshot = await getDocs(newsRef);
      const newsList = newsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNewsItems(newsList);
    };

    fetchNewsItems();
  }, [db]); */

  /*   const deleteNewsItem = async (newsId) => {
    try {
      await deleteDoc(doc(db, "news", newsId));
      setNewsItems(newsItems.filter((news) => news.id !== newsId));
    } catch (error) {
      console.error("Error deleting news item: ", error);
    }
  }; */

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

  return (
    <div className="admin-container">
      <h1>Admin Panel</h1>
      <br />
      <section className="section">
        <p className="warning-text">ALWAYS LOGOUT WHEN DONE!</p>
        <button onClick={handleLogout}>Logout</button>
      </section>
      {/* Change Email and Password form */}
{/*       
      // This still needs work!
      <div>
      <h2>Email and Password Management:</h2>
        <input type="email" onChange={(e) => setNewEmail(e.target.value)} />
        <button onClick={() => handleChangeEmail(newEmail)}>
          Change Email
        </button>

        <input
          type="password"
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button onClick={() => handleChangePassword(newPassword)}>
          Change Password
        </button>
      </div> */}

      {/* Featured Song Form */}

      {/*       <section className="section">
        <h2>Featured Song Management:</h2>
        <div>
          <p>ONLY USE YOUTUBE URLS!</p>
          <label>
            YouTube URL:
            <input
              type="text"
              value={featuredSongURL}
              onChange={(e) => setFeaturedSongURL(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Title:
            <input
              type="text"
              value={featuredSongTitle}
              onChange={(e) => setFeaturedSongTitle(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Artist:
            <input
              type="text"
              value={featuredSongArtist}
              onChange={(e) => setFeaturedSongArtist(e.target.value)}
            />
          </label>
        </div>
        <button onClick={handleUpdateFeaturedSong}>Update Featured Song</button>
      </section> */}

      {/* Latest News Form */}
      {/*       <section>
        <div className="container mt-5">
          <h1>Admin - Add Latest News</h1>

          {error && <div style={{ color: "red" }}>{error}</div>}

          <div className="mb-3">
            <label htmlFor="newsTitle" className="form-label">
              News Title
            </label>
            <input
              type="text"
              className="form-control"
              id="newsTitle"
              value={newsTitle}
              onChange={handleTitleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="newsContent" className="form-label">
              News Content
            </label>
            <textarea
              className="form-control"
              id="newsContent"
              rows="3"
              value={newsContent}
              onChange={handleContentChange}
            ></textarea>
          </div>

          <div className="mb-3">
            <label htmlFor="newsDate" className="form-label">
              Date
            </label>
            <input
              type="date"
              className="form-control"
              id="newsDate"
              value={newsDate}
              onChange={handleDateChange}
            />
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAddNews}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add News"}
          </button>
        </div>
      </section>
      <section>
        {" "}
        <div>
          <h2>Manage News Items</h2>
          {newsItems.map((news) => (
            <div key={news.id}>
              <h3>{news.title}</h3>
              <p>{news.content}</p>
              <button onClick={() => deleteNewsItem(news.id)}>Delete</button>
            </div>
          ))}
        </div>
      </section>
 */}
      {/* Event Form */}
      <h2>Event Management:</h2>
      <section className="section">
        <br />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddEvent();
          }}
        >
          <div>
            <label>
              Event Name:
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              Event Date:
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              Event Starting Time: {/* Added input for event time */}
              <input
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              Event Ending Time: {/* Added input for event time */}
              <input
                type="time"
                value={eventEndingTime}
                onChange={(e) => setEventEndingTime(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              Location:
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </label>
          </div>
          <button type="submit">Add Event</button>
        </form>
      </section>
      <section>
        {events.map((event) => (
          <div key={event.id}>
            <h3>{event.eventName}</h3>
            <p>{event.eventDate.toDate().toLocaleDateString()}</p>
            <p>
              {event.eventTime
                ? toStandardTime(event.eventTime)
                : "Time not set"}
            </p>
            <p>
                {event.eventEndingTime
                  ? toStandardTime(event.eventEndingTime)
                  : "Time not set"}
              </p>
            <p>{event.location}</p>
            <button onClick={() => handleDeleteEvent(event.id)}>Delete</button>
          </div>
        ))}
      </section>

      <section />
      {/* Gallery Form */}
      <section className="section">
        <h2>Gallery Management:</h2>
        <p className="warning-text">
          There is a 20 Photo Limit. If there is an issue after deleting images,
          refresh page to reset limit!
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleImageUpload();
          }}
        >
          <div>
            <label>
              Image:
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>
          </div>
          <button type="submit">Upload Image</button>
        </form>
        <div>
          {gallery.map((image) => (
            <div key={image.id}>
              <h3>{image.title}</h3>
              <img src={image.url} alt={image.title} />
              <button onClick={() => handleDeleteImage(image)}>Delete</button>
            </div>
          ))}
        </div>
      </section>

      {/* Message Form */}
      <section className="section">
        <div>
          <section>
            <h2>Messages</h2>
            <button onClick={handleOpenMessages}>
              Delete All Messages
            </button>{" "}
            {/* Button to view messages */}
            {messages.map((message) => (
              <div key={message.id}>
                <p>Name: {message.name}</p>
                <p>Email: {message.email}</p>
                <p>Message: {message.message}</p>
                <p>Date: {message.timestamp?.toDate().toLocaleString()}</p>
                <button onClick={() => handleDeleteMessage(message.id)}>
                  Delete Message
                </button>
              </div>
            ))}
          </section>
        </div>
      </section>

      {/* Music Form */}
      <section className="section">
        <h2>Music Management</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleMusicUpload();
          }}
        >
          <div>
            <label>
              Music Title:
              <input
                type="text"
                value={musicTitle}
                onChange={(e) => setMusicTitle(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              Release Date:
              <input
                type="date"
                value={musicReleaseDate}
                onChange={(e) => setMusicReleaseDate(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              Music URL:
              <p>Use an embedded URL to display an iframe.</p>
              <input
                type="text"
                value={musicURL}
                onChange={(e) => setMusicURL(e.target.value)}
              />
            </label>
          </div>
          <button type="submit">Add Music</button>
        </form>
        <div>
          {musicList.map((music) => (
            <div key={music.id}>
              <h3>{music.title}</h3>
              <p>{music.artist}</p>
              <button onClick={() => handleDeleteMusic(music.id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Admin;
