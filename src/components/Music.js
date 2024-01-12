import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import "./css/Music.css";

const Music = () => {
  const [musicList, setMusicList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const musicCollection = query(collection(db, "Music"), orderBy("releaseDate", "desc"));
        const musicSnapshot = await getDocs(musicCollection);
        const musicList = musicSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            ...data,
            releaseDate: data.releaseDate.toDate(),
            id: doc.id,
          };
        });
        setMusicList(musicList);
      } catch (error) {
        console.error("Error fetching music data: ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="music-background">
      <div className="music-container">
        <section>
        <h1>Music</h1>
        </section>
        {musicList.map((music) => (
          <div key={music.id} className="music-item">
            <h2>{music.title}</h2>
            <p>
              Release Date:{" "}
              {music.releaseDate
                ? music.releaseDate.toLocaleDateString()
                : "Not Available"}
            </p>
            {music.url && music.url.startsWith("<iframe") ? (
              <div
                className="iframe-container"
                dangerouslySetInnerHTML={{ __html: music.url }}
              />
            ) : (
              <a href={music.url} target="_blank" rel="noopener noreferrer">
                Listen Here
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Music;
