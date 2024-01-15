import React from "react";
import Footer from "./Footer";
import img2 from "../img/zhome2.gif";
import "./css/About.css";

function About() {
  return (
    <>
      <div className="about-container mt-5">
        <h1>Meet Dan Broe: A Life in Music</h1>
        <section className="image-section">
        <img src={img2} alt="Dan Broe" />
      </section>
        <p>
          Dan Broe has been a musician all his life. He was a traveling musician
          between Seattle, Wa. and San Francisco, Ca. in his early days of
          performing. In the late 60’s he moved to New Orleans, La. and for the
          next 12 years he performed in hundreds of venues in the French
          Quarter, Fat City, and the west bank of New Orleans. For several
          years, he was the house performer at Papa Joe’s on Bourbon Street.
        </p>
        <p>
          Dan studied music at Loyola University and later at Louisiana State
          University. He was a music teacher in the East Baton Rouge Parish
          School System for 26 years. He was featured in concert at the Shaw
          Center and he often plays at the Jolie Pearl in downtown Baton Rouge.
          You can catch Dan every Friday night at La Divina’s in Baton Rouge
          performing his own original music.
        </p>
      </div>
      <Footer />
    </>
  );
}

export default About;
