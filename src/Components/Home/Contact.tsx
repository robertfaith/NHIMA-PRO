import React, { useState } from "react";
import './Contact.scss'
import { TiMessages } from "react-icons/ti";
import { GoMail } from "react-icons/go";
import { FaPhoneAlt } from "react-icons/fa";
import { GrFormNextLink } from "react-icons/gr";

const Contact = () => {
  const [result, setResult] = useState<string>("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResult("Sending....");

    const formData = new FormData(event.currentTarget);
    formData.append("access_key", "1d281638-d29b-4c0a-8b74-38f3461c43d2");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      setResult("Form Submitted Successfully");
      event.currentTarget.reset();
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  };

  return (
    <div className="contact">
      <div className="contact-co">
        <h3>Send Us a Message <TiMessages /></h3>
        <p>
          Feel free to reach out through the contact form or find our contact information below. 
          Your feedback, questions, and suggestions are important to us as we strive to provide exceptional service.
        </p>
        <ul>
          <li><GoMail /> robtechinnovations@gmail.com</li>
          <li><GoMail /> robertfaith38@gmail.com</li>
          <li><FaPhoneAlt /> +260 974900193</li>
          <li><FaPhoneAlt /> +260 953915558</li>
        </ul>
      </div>

      <div className="contact-co">
        <h3>Contact Us</h3>
        <form onSubmit={onSubmit}>
          <div>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" placeholder="Enter your name" required />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" placeholder="Enter your email" required />
          </div>
          <div>
            <label htmlFor="message">Message:</label>
            <textarea id="message" name="message" rows={6} placeholder="Enter your message" required></textarea>
          </div>
          <button type="submit" className="send-button">
            Send Message <GrFormNextLink />
          </button>
        </form>
        <span>{result}</span>
      </div>
    </div>
  );
};

export default Contact;
