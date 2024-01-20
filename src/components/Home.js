import React from "react";
import "./css/Home.css";
import img from "../img/zhomefinal2.png";
import Footer from "./Footer";

function Home() {
  return (
    <div className="home-background-image">
      <div className="container mt-5">
        {/* Image Section */}
        <section className="image-section">
          <img src={img} alt="Dan Broe" />
        </section>

        {/* Upcoming Events Section */}
{/*         <section>
          <div class="box">
            <Events />
          </div> 
        </section>*/}
      </div>

      <Footer />
    </div>
  );
}

export default Home;
