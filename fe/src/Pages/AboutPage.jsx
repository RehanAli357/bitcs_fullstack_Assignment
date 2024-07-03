import React from 'react';
import User1 from "../Assets/user-1.jpeg"
import User2 from "../Assets/user-2.jpeg"

const AboutPage = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About Us</h1>
      </div>
      <div className="about-content">
        <p>
          Welcome to our Bike Rental Service! We are dedicated to providing you with the best bike rental experience possible. Our wide range of bikes ensures that you'll find the perfect ride for your needs, whether you're exploring the city or hitting the trails.
        </p>
        <p>
          Our mission is to promote a healthy and eco-friendly lifestyle by making biking accessible and enjoyable for everyone. We pride ourselves on offering top-quality bikes, excellent customer service, and competitive pricing.
        </p>
        <p>
          Thank you for choosing our Bike Rental Service. We look forward to helping you embark on your next adventure!
        </p>
      </div>
      <div className="about-team">
        <h2>Our Team</h2>
        <div className="team-members">
          <div className="team-member">
            <img src={User1} alt="Team Member 1" />
            <h3>John Doe</h3>
            <p>Founder & CEO</p>
          </div>
          <div className="team-member">
            <img src={User2} alt="Team Member 2" />
            <h3>Jane Smith</h3>
            <p>Chief Operations Officer</p>
          </div>
          {/* Add more team members as needed */}
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
