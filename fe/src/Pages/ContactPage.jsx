import React from 'react';

const ContactPage = () => {
  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>Contact Us</h1>
      </div>
      <div className="contact-content">
        <p>
          We'd love to hear from you! Whether you have a question about our bike rental service, need assistance, or just want to share your experience, feel free to reach out to us.
        </p>
        <div className="contact-info">
          <h2>Contact Information</h2>
          <p>Email: support@bikerental.com</p>
          <p>Phone: +1 123 456 7890</p>
          <p>Address: 123 Bike Street, Cycle City, CA 12345</p>
        </div>
        <div className="contact-form">
          <h2>Send Us a Message</h2>
          <form>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows="5" required></textarea>
            </div>
            <button type="submit" className="primary-btn">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
