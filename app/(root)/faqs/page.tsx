"use client";
import React from "react";
import Loader from "@/components/Loader";
import { useState, useEffect } from "react";

const FAQ = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => setLoading(false), 3000);
  }, []);

  if (loading) {
    return <Loader />;
  }
  const faqs = [
    {
      id: "eagles-ring",
      question: "What is Eagles Ring?",
      answer: (
        <>
          Eagles Ring is an investment platform that matches aspiring
          entrepreneurs from around the world with investment opportunities.
          Entrepreneurs are invited to pitch their business models in front of a
          carefully curated panel of highly esteemed local and international
          business moguls, known as the “Eagles.” The Eagles are able and
          willing to invest their own money as well as time in bankrolling
          potentially lucrative business solutions. Inside the Ring, the Eagles
          compete for the best investment opportunity. The trick is to share a
          compelling story that will convince these highly experienced Eagles
          that your solution is a worthwhile investment opportunity.
        </>
      ),
    },
    {
      id: "signup",
      question: "How can I sign up as an entrepreneur or investor?",
      answer:
        "You can sign up by visiting our registration page and selecting the role that best fits your profile. You will need to provide some basic information and create an account.",
    },
    {
      id: "pitch",
      question: "How do I pitch my business idea?",
      answer:
        "Once you have signed up as an entrepreneur, you can submit your business pitch through our platform. You will be guided through the process and provided with tips to help you create a compelling pitch.",
    },
    {
      id: "review-pitches",
      question: "How do investors review pitches?",
      answer:
        "Investors can browse through submitted pitches and review them based on their investment preferences. They may request additional information or schedule meetings with entrepreneurs they are interested in.",
    },
    {
      id: "support",
      question: "How can I contact support?",
      answer: (
        <>
          If you have any questions or need assistance, you can contact our
          support team via the contact form on our website or by emailing us at{" "}
          <a
            href="mailto:support@eaglesring.com"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            support@eaglesring.com
          </a>
          .
        </>
      ),
    },
    {
      id: "video-conferencing",
      question: "How does the video conferencing feature work?",
      answer:
        "Our platform supports video conferencing with all Zoom functions. You can schedule, host, and join meetings directly through our interface. Features include screen sharing, recording, breakout rooms, and real-time chat.",
    },
    {
      id: "file-sharing",
      question: "How can I share files on the platform?",
      answer:
        "You can upload and share files with other users through our secure file-sharing system. Files can be shared in messages or during meetings, and you can set permissions to control access.",
    },
    {
      id: "messaging",
      question: "What messaging features are available?",
      answer:
        "Our platform includes a messaging system that allows you to send direct messages, create group chats, and share files and media. You can also organize conversations into threads and search your message history.",
    },
    {
      id: "photo-sharing",
      question: "Can I share photos on the platform?",
      answer:
        "Yes, you can share photos within messages and during meetings. Our platform supports various photo formats and allows you to organize and view shared photos in dedicated galleries.",
    },
    {
      id: "pricing",
      question: "What are the pricing plans?",
      answer: (
        <>
          We offer several pricing plans to suit different needs:
          <ul className="list-disc list-inside mt-2">
            <li>
              <strong>Basic Plan:</strong> Includes essential features for
              individual users and small teams.
            </li>
            <li>
              <strong>Pro Plan:</strong> Offers advanced features including
              unlimited video conferencing, increased file storage, and priority
              support.
            </li>
            <li>
              <strong>Enterprise Plan:</strong> Tailored solutions for larger
              organizations with customized features and dedicated support.
            </li>
          </ul>
          For detailed pricing and to find the best plan for your needs, please
          visit our{" "}
          <a
            href="/pricing"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            pricing page
          </a>
          .
        </>
      ),
    },
    {
      id: "security",
      question: "How is my data secured on the platform?",
      answer:
        "We use industry-standard encryption protocols to ensure that your data is secure. All communications and file transfers are encrypted using SSL/TLS, and we regularly update our security measures to protect against new threats.",
    },
    {
      id: "account-recovery",
      question: "What should I do if I forget my password?",
      answer:
        'You can reset your password by clicking on the "Forgot Password" link on the login page. Follow the instructions sent to your email to reset your password and regain access to your account.',
    },
    {
      id: "integration",
      question: "Does the platform integrate with other tools?",
      answer:
        "Yes, our platform integrates with various third-party tools and services, including calendar applications, CRM systems, and cloud storage solutions. Check our integrations page for a full list of supported tools.",
    },
    {
      id: "notifications",
      question: "How can I manage notifications?",
      answer:
        "You can manage your notification preferences in your account settings. Choose which types of notifications you want to receive and how you would like to be notified (e.g., email, in-app).",
    },
    {
      id: "customization",
      question: "Can I customize my user profile?",
      answer:
        "Yes, you can customize your profile by adding a profile picture, updating your bio, and adjusting your account settings. Go to your profile settings to make these changes.",
    },
    {
      id: "meeting-scheduling",
      question: "How do I schedule a meeting?",
      answer:
        'To schedule a meeting, navigate to the "Schedule" section on your dashboard or use the meeting link available in the navigation bar. Select the date and time, and invite participants. You can also add agenda items and attach relevant documents.',
    },
    {
      id: "document-storage",
      question: "How much document storage is included?",
      answer:
        "The amount of document storage depends on your pricing plan. Basic users get a limited amount of storage, while Pro and Enterprise plans offer increased storage capacity. Check your plan details for more information.",
    },
    {
      id: "user-roles",
      question: "What user roles are available on the platform?",
      answer:
        "We offer two main roles: Entrepreneur and Investor. Entrepreneurs pitch their business ideas to investors, while Investors review pitches and decide on investment opportunities. Each role has different features and access levels.",
    },
    {
      id: "payment-methods",
      question: "What payment methods do you accept?",
      answer:
        "We accept various payment methods including credit/debit cards, PayPal, and bank transfers. You can manage your payment information in the billing section of your account settings.",
    },
    {
      id: "refund-policy",
      question: "What is your refund policy?",
      answer:
        "We offer a 30-day money-back guarantee for all our subscription plans. If you are not satisfied with our platform within the first 30 days, you can request a full refund by contacting our support team.",
    },
    {
      id: "api-access",
      question: "Can I access your API?",
      answer:
        "Currently, API access is not available. We are working on providing API integrations in the future and will notify users once this feature is available.",
    },
    {
      id: "terms-updates",
      question:
        "How will I be notified of changes to the terms and conditions?",
      answer:
        "We will notify you of any changes to the terms and conditions via email and update the revision date on the terms page. It is your responsibility to review the terms regularly to stay informed.",
    },
    {
      id: "feature-requests",
      question: "Can I request new features?",
      answer:
        "Yes, we welcome feedback and feature requests from our users. You can submit your requests through our feedback form or contact our support team with your suggestions.",
    },
    {
      id: "training",
      question: "Do you offer training for using the platform?",
      answer:
        "Yes, we offer training sessions and webinars to help you get the most out of our platform. Check our training resources page for upcoming sessions and additional materials.",
    },
    {
      id: "bug-reporting",
      question: "How can I report a bug?",
      answer:
        "If you encounter any issues or bugs, please report them through our bug tracking system or contact our support team. Provide detailed information about the issue to help us resolve it quickly.",
    },
    {
      id: "community",
      question: "Is there a community forum for users?",
      answer:
        "Yes, we have a community forum where users can discuss features, share tips, and connect with other members. You can access the forum through the community section of our website.",
    },
    {
      id: "role-assignment",
      question: "Can I change my role after assigning it?",
      answer:
        "Once a role is assigned, it cannot be changed. You can only choose one role: Entrepreneur or Investor. The role assignment is permanent and will persist across sessions and devices.",
    },
    {
      id: "meeting-link",
      question: "Where can I find the meeting link?",
      answer:
        'The meeting link is accessible from the navigation bar or your dashboard under the "Meetings" section. You can also find it in your scheduled meetings list.',
    },
  ];

  return (
    <div className="max-w-full px-6 py-8 mx-auto">
      <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>
      <div className="space-y-4 w-full">
        {faqs.map((faq) => (
          <div key={faq.id} className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-2">{faq.question}</h2>
            <p className="text-gray-700 dark:text-gray-300">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
