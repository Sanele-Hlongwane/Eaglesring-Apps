"use client";
import { useEffect, useState } from "react";
import { title } from "@/components/primitives";
import Loader from "@/components/Loader";

export default function AboutPage() {
  
  return (
    <div className="max-w-ful mx-auto">
      <h2 className={`${title()} text-center text-sm text-lg mb-8`}>About Eagles Ring</h2>

      <section className="mb-12">
        <h2 className="text-lg font-semibold mb-4">Welcome to Eagles Ring</h2>
        <p className="text-sm mb-6">
          Eagles Ring is a premier platform that connects entrepreneurs with
          investors to foster innovative business ideas and growth. Our mission
          is to provide a seamless experience for both startups and investors,
          facilitating meaningful connections and successful investments.
        </p>

        <div className="flex flex-col gap-8 md:flex-row">
          <div className="md:w-1/2 mb-6">
            <h3 className=" font-semibold mb-4">Our Vision</h3>
            <p className=" mb-4">
              Our vision is to empower entrepreneurs and investors to reach
              their full potential by offering a robust and user-friendly
              platform. We believe in driving innovation and supporting the next
              generation of business leaders.
            </p>
            <a
              href="/about#vision"
              className="hover:underline text-primary font-semibold"
            >
              Learn more about our vision
            </a>
          </div>

          <div className="md:w-1/2 mb-6">
            <h3 className="text-lg font-semibold mb-4">How It Works</h3>
            <p className="text-sm mb-4">
              Eagles Ring simplifies the investment process by providing a
              comprehensive suite of tools for entrepreneurs to pitch their
              ideas and for investors to evaluate opportunities. Our platform
              supports detailed profiles, secure transactions, and effective
              communication channels.
            </p>
            <a
              href="/about#how-it-works"
              className="hover:underline text-primary font-semibold"
            >
              Discover how Eagles Ring works
            </a>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
        <p className="text-sm mb-6">
          Meet the talented team behind Eagles Ring. Our diverse team brings
          together experts in technology, finance, and business development to
          ensure the platform&apos;s success and innovation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Team Member 1 */}
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">John Doe</h3>
            <p className="text-sm mb-4">Founder & CEO</p>
            <p className="text-sm mb-4">
              John is a visionary entrepreneur with a passion for technology and
              innovation. He leads the team with a focus on creating a
              cutting-edge platform for the investment community.
            </p>
            <a
              href="https://linkedin.com/in/johndoe"
              className="hover:underline text-primary font-semibold"
              target="_blank"
              rel="noopener noreferrer"
            >
              Connect with John
            </a>
          </div>

          {/* Team Member 2 */}
          <div className="border rounded-lg  p-6">
            <h3 className="text-lg font-semibold mb-2">Jane Smith</h3>
            <p className="text-sm mb-4">Chief Technology Officer</p>
            <p className="text-sm mb-4">
              Jane is an expert in software development and technology. She
              oversees the platform&apos;s technical aspects, ensuring a
              seamless and secure experience for all users.
            </p>
            <a
              href="https://linkedin.com/in/janesmith"
              className="hover:underline text-primary font-semibold"
              target="_blank"
              rel="noopener noreferrer"
            >
              Connect with Jane
            </a>
          </div>

          {/* Team Member 3 */}
          <div className="border rounded-lg  p-6">
            <h3 className="text-lg font-semibold mb-2">Emily Johnson</h3>
            <p className="text-sm mb-4">Head of Investor Relations</p>
            <p className="text-sm mb-4">
              Emily manages relationships with investors and ensures they have
              access to the best opportunities. She is dedicated to providing
              exceptional support and guidance.
            </p>
            <a
              href="https://linkedin.com/in/emilyjohnson"
              className="hover:underline text-primary font-semibold"
              target="_blank"
              rel="noopener noreferrer"
            >
              Connect with Emily
            </a>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Our Achievements</h2>
        <p className="text-sm mb-6">
          We are proud of the milestones we have achieved since launching Eagles
          Ring. Our platform has successfully facilitated numerous investments
          and fostered growth for startups around the world.
        </p>
        <ul className="list-disc list-inside mb-6 space-y-2">
          <li className="text-sm">Over 500 successful investment matches</li>
          <li className="text-sm">
            Recognized as a top platform for startup funding
          </li>
          <li className="text-sm">
            Partnerships with leading venture capital firms
          </li>
          <li className="text-sm">
            Extensive user base with positive feedback
          </li>
        </ul>
        <a
          href="/about#achievements"
          className="hover:underline text-primary font-semibold"
        >
          Learn more about our achievements
        </a>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Get In Touch</h2>
        <p className="text-sm mb-4">
          We&apos;d love to hear from you! Whether you have questions about our
          platform, feedback, or partnership opportunities, feel free to reach
          out to us.
        </p>
        <a
          href="/contact"
          className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark block text-center"
        >
          Contact Us
        </a>
      </section>
    </div>
  );
}
