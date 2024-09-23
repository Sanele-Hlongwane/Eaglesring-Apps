"use client";
import { useState, useEffect } from "react";
import Loader from "@/components/Loader";

const TermsAndConditions = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => setLoading(false), 3000);
  }, []);

  if (loading) {
    return <Loader />;
  }

  const sections = [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      content:
        "By accessing and using our platform, you accept and agree to be bound by these terms and conditions. If you do not agree to these terms, you must not use our platform.",
    },
    {
      id: "user-accounts",
      title: "User Accounts",
      content:
        "To use certain features of our platform, you may be required to create an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.",
    },
    {
      id: "user-conduct",
      title: "User Conduct",
      content: (
        <>
          <p className="mb-4">
            You agree to use our platform only for lawful purposes and in
            accordance with these terms. You agree not to use our platform:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>
              In any way that violates any applicable federal, state, local, or
              international law or regulation.
            </li>
            <li>
              For the purpose of exploiting, harming, scamming or attempting to exploit
              or harm minors in any way.
            </li>
            <li>
              To transmit, or procure the sending of, any advertising or
              promotional material without our prior written consent.
            </li>
            <li>
              To impersonate or attempt to impersonate the company, an employee,
              another user, or any other person or entity.
            </li>
            <li>
              To engage in any other conduct that restricts or inhibits
              anyone&apos;s use or enjoyment of our platform, or which, as
              determined by us, may harm the company or users of the platform or
              expose them to liability.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property Rights",
      content:
        "Our platform and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, and other materials) are protected by intellectual property laws. You may not use, reproduce, distribute, or display any content from our platform without obtaining the necessary rights.",
    },
    {
      id: "termination",
      title: "Termination",
      content:
        "We reserve the right to terminate or suspend your account and access to our platform at our sole discretion, without prior notice or liability, for any reason, including if you breach these terms.",
    },
    {
      id: "disclaimer",
      title: "Disclaimer of Warranties",
      content:
        'Our platform is provided on an "as is" and "as available" basis. We disclaim all warranties, express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.',
    },
    {
      id: "limitation",
      title: "Limitation of Liability",
      content:
        "To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or in connection with your use of our platform.",
    },
    {
      id: "governing-law",
      title: "Governing Law",
      content:
        "These terms and conditions shall be governed by and construed in accordance with the laws of South Africa, without regard to its conflict of law principles.",
    },
    {
      id: "changes",
      title: "Changes to Terms",
      content:
        "We reserve the right to modify these terms at any time. Any changes will be posted on this page with an updated revision date. Your continued use of our platform after such changes constitutes your acceptance of the new terms.",
    },
    {
      id: "contact",
      title: "Contact Information",
      content: (
        <>
          <p className="mb-4">
            If you have any questions about these terms and conditions, please
            contact us at{" "}
            <a
              href="mailto:contact@eaglesring.com"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              contact@eaglesring.com
            </a>
            .
          </p>
        </>
      ),
    },
  ];

  return (
    <div className="text-align-center">
      <h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1>

      <h2 className="text-2xl font-semibold mb-2">Table of Contents</h2>
      <ul className="list-decimal list-inside mb-6">
        {sections.map((section) => (
          <li key={section.id} className="mb-2">
            <a
              href={`#${section.id}`}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {section.title}
            </a>
          </li>
        ))}
      </ul>

      <div className="flex justify-center mt-12 relative">
        <div className="relative w-3/5 h-12 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center animated-text text-white text-lg">
            <p>
              © 2024 Eagles Ring. All rights reserved. Unauthorized use is
              prohibited.
            </p>
          </div>
        </div>
      </div>

      {sections.map((section) => (
        <div key={section.id} id={section.id} className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">{section.title}</h2>
          <p className="mb-4">{section.content}</p>
        </div>
      ))}
    </div>
  );
};

export default TermsAndConditions;
