import React, { useState } from "react";
import { TiMessages } from "react-icons/ti";
import { GoMail } from "react-icons/go";
import { FaPhoneAlt, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { GrFormNextLink } from "react-icons/gr";
import { MdLocationOn, MdAccessTimeFilled } from "react-icons/md";

type Status = "idle" | "sending" | "success" | "error";

const quickContacts = [
  { icon: <GoMail />, label: "General Enquiries", value: "info@nhima.co.zm" },
  { icon: <GoMail />, label: "Support", value: "support@nhima.co.zm" },
  { icon: <FaPhoneAlt />, label: "Phone", value: "+260 211 123 456" },
  { icon: <FaPhoneAlt />, label: "Toll Free", value: "909" },
];

const ContactForm = () => {
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");

    const formData = new FormData(event.currentTarget);
    formData.append("access_key", "1d281638-d29b-4c0a-8b74-38f3461c43d2");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        event.currentTarget.reset();
      } else {
        console.log("Error", data);
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  const inputClasses =
    "w-full bg-[#f7f9fc] border border-[#dce4ee] rounded-[10px] p-[15px] mb-5 text-[15px] transition-all duration-300 ease-in-out focus:border-[#0056a4] focus:ring-[3px] focus:ring-[#0056a4]/15 focus:outline-none focus:bg-white";

  return (
    <section className="max-w-[1400px] mx-auto my-20 px-[5%]">

      {/* Quick contact cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-[50px]">
        {quickContacts.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex flex-col items-start gap-2 hover:-translate-y-1 transition-transform duration-300"
          >
            <div className="w-10 h-10 rounded-full bg-[#0056a4]/10 text-[#0056a4] flex items-center justify-center text-lg">
              {item.icon}
            </div>
            <p className="text-xs text-[#5f6b7a] font-medium">{item.label}</p>
            <p className="text-sm text-[#243447] font-semibold break-all">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-[50px] items-start">

        {/* Contact Information + Map */}
        <div className="flex-1 w-full flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-[35px] shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
            <h3 className="flex items-center gap-2.5 text-[#0056a4] text-[28px] font-bold mb-5">
              Send Us a Message <TiMessages />
            </h3>

            <p className="text-[#5f6b7a] leading-[1.8] text-[15px] mb-6">
              We value your feedback and inquiries. Whether you need assistance,
              have a question about NHIMA services, or wish to provide feedback,
              our team is ready to assist you.
            </p>

            <div className="bg-[#f8fbff] border-l-[5px] border-[#0056a4] p-5 rounded-[10px]">
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

          {/* Map */}
          <div className="rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.08)] h-[280px]">
            <iframe
              title="NHIMA Headquarters Location"
              src="https://www.google.com/maps?q=Levy+Business+Park,+Lusaka,+Zambia&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
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
              disabled={status === "sending"}
              className="flex items-center justify-center gap-2 bg-[#0056a4] text-white border-none rounded-[10px] px-[30px] py-[14px] text-[15px] font-semibold cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {status === "sending" ? "Sending..." : "Send Message"}
              <GrFormNextLink className="text-lg" />
            </button>
          </form>

          {status === "success" && (
            <div className="flex items-center gap-2 mt-5 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
              <FaCheckCircle /> Message submitted successfully.
            </div>
          )}

          {status === "error" && (
            <div className="flex items-center gap-2 mt-5 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <FaExclamationCircle /> Something went wrong. Please try again.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactForm;