import React, { useState } from "react";
import "./ContactForm.scss";

import { TiMessages } from "react-icons/ti";
import { GoMail } from "react-icons/go";
import { FaPhoneAlt } from "react-icons/fa";
import { GrFormNextLink } from "react-icons/gr";
import { MdLocationOn } from "react-icons/md";
import { MdAccessTimeFilled } from "react-icons/md";

const Contact = () => {
  const [result, setResult] = useState<string>("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResult("Sending message...");

    const formData = new FormData(event.currentTarget);
    formData.append("access_key", "1d281638-d29b-4c0a-8b74-38f3461c43d2");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      setResult("✅ Message submitted successfully.");
      event.currentTarget.reset();
    } else {
      console.log("Error", data);
      setResult("❌ Failed to send message.");
    }
  };

  return (
    <section className="contact">
      {/* Contact Information */}
      <div className="contact-co">
        <h3>
          Send Us a Message <TiMessages />
        </h3>

        <p>
          We value your feedback and inquiries. Whether you need assistance,
          have a question about NHIMA services, or wish to provide feedback,
          our team is ready to assist you.
        </p>

        <ul>
          <li>
            <GoMail />
            info@nhima.co.zm
          </li>

          <li>
            <GoMail />
            support@nhima.co.zm
          </li>

          <li>
            <FaPhoneAlt />
            +260 211 123 456
          </li>

          <li>
            <FaPhoneAlt />
            Toll Free: 909
          </li>
        </ul>

        <div className="contact-info-box">
          <h4>NHIMA Headquarters</h4>

          <p>
            <MdLocationOn />
            Levy Business Park, Lusaka, Zambia
          </p>

          <p>
            <MdAccessTimeFilled />
            Monday - Friday: 08:00 AM - 05:00 PM
          </p>
        </div>
      </div>

      {/* Contact Form */}
      <div className="contact-co">
        <h3>Contact Form</h3>

        <form onSubmit={onSubmit}>
          <div>
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email address"
              required
            />
          </div>

          <div>
            <label htmlFor="phone">Phone Number</label>
            <input
              type="text"
              id="phone"
              name="phone"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows={6}
              placeholder="Type your message here..."
              required
            ></textarea>
          </div>

          <button type="submit" className="send-button">
            Send Message
            <GrFormNextLink />
          </button>
        </form>

        <span>{result}</span>
      </div>
    </section>
  );
};

export default Contact;