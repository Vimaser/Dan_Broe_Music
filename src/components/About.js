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
          Dan Broe has been a musician all of his life. His early career was
          spent playing at fairs, festivals, and coffee houses between Seattle,
          Washington, and San Francisco, California. In the late '60s, he moved
          to New Orleans, Louisiana, and for the next two years, he traveled
          back and forth between New Orleans and Chicago, Illinois, picking up
          performance jobs in Natchez, Mississippi, and Memphis, Tennessee along
          the way. In the 1970s, he settled down in New Orleans and began
          studying music at Delgado Jr. College and later at Loyola University.
          During this period, he was a featured weekly artist at Papa Joe’s on
          Bourbon Street and the house performer at the Steak and Ale on the New
          Orleans west bank.
        </p>
        <p>
          For the next 12 years, he performed all over the New Orleans area, and
          in 1986, he moved to Baton Rouge, Louisiana, to study music at
          Louisiana State University. In 1992, he began a 26-year career
          teaching Music in the East Baton Rouge Parish Public School System.
          During this time, he has been a featured artist at the Londoner,
          Daltons, the Shaw Center, and dozens of other venues throughout the
          Baton Rouge area.
        </p>
        <p>
          Most recently, he has immersed himself in the rich songwriting
          community of Baton Rouge. He hosts an open mic for local songwriters
          at La Divina’s Italian Café every Friday night and has hosted several
          singer-songwriter showcases at the Jolie Pearl in downtown Baton
          Rouge.
        </p>
        <p>
          Because of his years of performing experience, Dan is able to bring to
          any venue an extensive library of styles and sounds. Drawing from
          three albums worth of original music and approximately 150 cover
          songs, he is able to craft a performance for almost any environment.
          From Jazz to Country, Rhythm and Blues to Folk, Dan Broe can and does
          deliver exactly what you're looking for.
        </p>
      </div>
      <Footer />
    </>
  );
}

export default About;
