import React, { useState } from "react";
import { TiMessages } from "react-icons/ti";
import { GoMail } from "react-icons/go";
import { FaPhoneAlt } from "react-icons/fa";
import { GrFormNextLink } from "react-icons/gr";
import { MdLocationOn, MdAccessTimeFilled } from "react-icons/md";

const Contact = () => {
  const [result, setResult] = useState<string>("");
  const [isSending, setIsSending] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSending(true);
    setResult("Sending message...");

    const formData = new FormData(event.currentTarget);
    formData.append("access_key", "1d281638-d29b-4c0a-8b74-38f3461c43d2");

    try {
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
    } catch (error) {
      setResult("❌ Something went wrong. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const inputClasses =
    "w-full bg-[#f7f9fc] border border-[#dce4ee] rounded-[10px] p-[15px] mb-5 text-[15px] transition-all duration-300 ease-in-out focus:border-[#0056a4] focus:ring-[3px] focus:ring-[#0056a4]/15 focus:outline-none focus:bg-white";

  return (
    <section className="max-w-[1400px] mx-auto my-20 px-[5%] flex flex-col lg:flex-row gap-[50px] items-start">

      {/* Contact Information */}
      <div className="flex-1 w-full bg-white rounded-2xl p-[35px] shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
        <h3 className="flex items-center gap-2.5 text-[#0056a4] text-[28px] font-bold mb-5">
          Send Us a Message <TiMessages />
        </h3>

        <p className="text-[#5f6b7a] leading-[1.8] text-[15px] mb-5">
          We value your feedback and inquiries. Whether you need assistance,
          have a question about NHIMA services, or wish to provide feedback,
          our team is ready to assist you.
        </p>

        <ul className="list-none p-0 mt-6">
          <li className="flex items-center gap-3 mb-[18px] text-[#2f3b4c] text-[15px] font-medium">
            <GoMail className="text-[#0056a4] text-lg shrink-0" />
            info@nhima.co.zm
          </li>

          <li className="flex items-center gap-3 mb-[18px] text-[#2f3b4c] text-[15px] font-medium">
            <GoMail className="text-[#0056a4] text-lg shrink-0" />
            support@nhima.co.zm
          </li>

          <li className="flex items-center gap-3 mb-[18px] text-[#2f3b4c] text-[15px] font-medium">
            <FaPhoneAlt className="text-[#0056a4] text-lg shrink-0" />
            +260 211 123 456
          </li>

          <li className="flex items-center gap-3 mb-[18px] text-[#2f3b4c] text-[15px] font-medium">
            <FaPhoneAlt className="text-[#0056a4] text-lg shrink-0" />
            Toll Free: 909
          </li>
        </ul>

        <div className="bg-[#f8fbff] border-l-[5px] border-[#0056a4] p-5 rounded-[10px] mt-6">
          <h4 className="text-[#0056a4] mb-[15px] font-semibold">
            NHIMA Headquarters
          </h4>

          <p className="flex items-center gap-2 my-2 text-[#5f6b7a] text-[15px]">
            <MdLocationOn className="text-[#0056a4] text-lg shrink-0" />
            Levy Business Park, Lusaka, Zambia
          </p>

          <p className="flex items-center gap-2 my-2 text-[#5f6b7a] text-[15px]">
            <MdAccessTimeFilled className="text-[#0056a4] text-lg shrink-0" />
            Monday - Friday: 08:00 AM - 05:00 PM
          </p>
        </div>
      </div>

      {/* Contact Form */}
      <div className="flex-1 w-full bg-white rounded-2xl p-[35px] shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
        <h3 className="flex items-center gap-2.5 text-[#0056a4] text-[28px] font-bold mb-5">
          Contact Form
        </h3>

        <form onSubmit={onSubmit} className="mt-2.5">
          <div>
            <label htmlFor="name" className="block mb-2 text-[#243447] font-semibold">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your full name"
              required
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-2 text-[#243447] font-semibold">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email address"
              required
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="phone" className="block mb-2 text-[#243447] font-semibold">
              Phone Number
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              placeholder="Enter your phone number"
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="message" className="block mb-2 text-[#243447] font-semibold">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              placeholder="Type your message here..."
              required
              className={`${inputClasses} resize-y`}
            />
          </div>

          <button
            type="submit"
            disabled={isSending}
            className="flex items-center justify-center gap-2 bg-[#0056a4] text-white border-none rounded-[10px] px-[30px] py-[14px] text-[15px] font-semibold cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {isSending ? "Sending..." : "Send Message"}
            <GrFormNextLink className="text-lg" />
          </button>
        </form>

        <span className="block mt-5 text-sm font-medium text-[#0056a4]">
          {result}
        </span>
      </div>
    </section>
  );
};

export default Contact;