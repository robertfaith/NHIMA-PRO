import React, { useState } from "react";
import { TiMessages } from "react-icons/ti";
import { GoMail } from "react-icons/go";
import { FaPhoneAlt } from "react-icons/fa";
import { GrFormNextLink } from "react-icons/gr";
import Testimonials from "./Testimonials";

const Contact = () => {
  const [result, setResult] = useState<string>("");
  const [isSending, setIsSending] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSending(true);
    setResult("Sending....");

    const formData = new FormData(event.currentTarget);
    formData.append("access_key", "1d281638-d29b-4c0a-8b74-38f3461c43d2");

    try {
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
    } catch (error) {
      setResult("Something went wrong. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

 return (
    <>
      <div className="my-20 max-w-[90%] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-10">

        <div className="basis-full md:basis-[48%] text-[#676767]">
          <h3 className="text-[#000f38] font-medium text-2xl flex items-center gap-2">
            Send Us a Message <TiMessages />
          </h3>
          <p className="text-base leading-[1.8] my-5 px-0 md:px-1">
            Feel free to reach out through the contact form or find our contact information below.
            Your feedback, questions, and suggestions are important to us as we strive to provide exceptional service.
          </p>
          <ul className="space-y-3">
            <li className="flex items-center gap-2">
              <GoMail className="text-[#000f38] shrink-0" /> robtechinnovations@gmail.com
            </li>
            <li className="flex items-center gap-2">
              <GoMail className="text-[#000f38] shrink-0" /> robertfaith38@gmail.com
            </li>
            <li className="flex items-center gap-2">
              <FaPhoneAlt className="text-[#000f38] shrink-0" /> +260 974900193
            </li>
            <li className="flex items-center gap-2">
              <FaPhoneAlt className="text-[#000f38] shrink-0" /> +260 953915558
            </li>
          </ul>
        </div>

        <div className="basis-full md:basis-[48%] text-[#676767]">
          <h3 className="text-[#000f38] font-medium text-2xl">Contact Us</h3>
          <form onSubmit={onSubmit} className="mt-5">
            <div>
              <label htmlFor="name" className="text-sm font-medium text-[#000f38]">
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name"
                required
                className="block w-full bg-[#ebecfe] p-[15px] border border-[#ccc] rounded-[5px] outline-none mb-[15px] mt-[5px] focus:ring-2 focus:ring-[#212ea0] transition-shadow"
              />
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-medium text-[#000f38]">
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                required
                className="block w-full bg-[#ebecfe] p-[15px] border border-[#ccc] rounded-[5px] outline-none mb-[15px] mt-[5px] focus:ring-2 focus:ring-[#212ea0] transition-shadow"
              />
            </div>
            <div>
              <label htmlFor="message" className="text-sm font-medium text-[#000f38]">
                Message:
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                placeholder="Enter your message"
                required
                className="block w-full bg-[#ebecfe] p-[15px] border border-[#ccc] rounded-[5px] outline-none mb-[15px] mt-[5px] resize-none focus:ring-2 focus:ring-[#212ea0] transition-shadow"
              />
            </div>
            <button
              type="submit"
              disabled={isSending}
              className="bg-[#000f38] text-white px-5 py-3 rounded-[5px] border-none cursor-pointer flex items-center gap-1 hover:bg-[#333] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSending ? "Sending..." : "Send Message"} <GrFormNextLink />
            </button>
          </form>
          <span className="block mt-2.5 text-sm text-[#999]">{result}</span>
        </div>

      </div>

      <Testimonials />
    </>
  );
}

export default Contact;