"use client";

import { useState, useEffect } from "react";
import Loader from "@/components/Loader";

const PrivacyPolicy = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 3000);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-full px-6 py-8 mx-auto">
      
      <h1 className="text-4xl font-extrabold mb-8 text-center">
        Privacy Policy
      </h1>
      <p className="text-lg mb-8 text-center">
        Your privacy is important to us. This privacy policy explains how we
        collect, use, disclose, and safeguard your information when you use our
        application. Please read this privacy policy carefully. If you do not
        agree with the terms of this privacy policy, please do not access the
        application.
      </p>

      <div className="space-y-4">
        <section>
          <h2 className="text-2xl font-semibold mb-2">
            1. Information We Collect
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            We may collect information about you in a variety of ways. The
            information we may collect via the application depends on the
            content and materials you use, and includes:
          </p>
          <ul className="list-disc list-inside mt-2 text-gray-700 dark:text-gray-300">
            <li>
              <strong>Personal Data:</strong> Personally identifiable
              information, such as your name, shipping address, email address,
              and telephone number.
            </li>
            <li>
              <strong>Derivative Data:</strong> Information our servers
              automatically collect when you access the application, such as
              your IP address, browser type, and usage data.
            </li>
            <li>
              <strong>Financial Data:</strong> Payment information, such as data
              related to your payment method (e.g., valid credit card number,
              card brand, and expiration date).
            </li>
            <li>
              <strong>Social Network Data:</strong> User information from social
              networking sites, such as Facebook, Google, etc., including your
              name, social network username, location, and profile picture.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">
            2. Use of Your Information
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Having accurate information about you permits us to provide you with
            a smooth, efficient, and customized experience. Specifically, we may
            use the information collected about you via the application to:
          </p>
          <ul className="list-disc list-inside mt-2 text-gray-700 dark:text-gray-300">
            <li>Create and manage your account.</li>
            <li>Process your transactions and manage your orders.</li>
            <li>Send you an email regarding your account or order.</li>
            <li>Enable user-to-user communications.</li>
            <li>Increase the efficiency and operation of the application.</li>
            <li>
              Monitor and analyze usage and trends to improve your experience
              with the application.
            </li>
            <li>Resolve disputes and troubleshoot problems.</li>
            <li>Respond to product and customer service requests.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">
            3. Disclosure of Your Information
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            We may share information we have collected about you in certain
            situations. Your information may be disclosed as follows:
          </p>
          <ul className="list-disc list-inside mt-2 text-gray-700 dark:text-gray-300">
            <li>
              <strong>By Law or to Protect Rights:</strong> If we believe the
              release of information about you is necessary to respond to legal
              process, to investigate or remedy potential violations of our
              policies, or to protect the rights, property, and safety of
              others.
            </li>
            <li>
              <strong>Business Transfers:</strong> We may share or transfer your
              information in connection with, or during negotiations of, any
              merger, sale of company assets, financing, or acquisition of all
              or a portion of our business to another company.
            </li>
            <li>
              <strong>Third-Party Service Providers:</strong> We may share your
              information with third parties that perform services for us or on
              our behalf, including payment processing, data analysis, email
              delivery, hosting services, customer service, and marketing
              assistance.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">
            4. Security of Your Information
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            We use administrative, technical, and physical security measures to
            help protect your personal information. While we have taken
            reasonable steps to secure the personal information you provide to
            us, please be aware that despite our efforts, no security measures
            are perfect or impenetrable, and no method of data transmission can
            be guaranteed against any interception or other type of misuse.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">
            5. Policy for Children
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            We do not knowingly solicit information from or market to children
            under the age of 13. If we learn we have collected personal
            information from a child under age 13 without verification of
            parental consent, we will delete that information as quickly as
            possible.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">
            6. Changes to This Policy
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            We may update this privacy policy from time to time in order to
            reflect, for example, changes to our practices or for other
            operational, legal, or regulatory reasons. We will notify you of any
            changes by updating the{" "}
            <strong className="text-gray-900 dark:text-gray-100">
              Last Updated
            </strong>{" "}
            date of this Privacy Policy. We encourage you to review this Privacy
            Policy periodically to stay informed about how we are protecting the
            personal information we collect.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">7. Contact Us</h2>
          <p className="text-gray-700 dark:text-gray-300">
            If you have questions or comments about this Privacy Policy, please
            contact us at:
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            <strong>Email:</strong>{" "}
            <a
              href="mailto:support@eaglesring.com"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              support@eaglesring.com
            </a>
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <strong>Mailing Address:</strong> 123 Eagles Ring Road, Business
            City, BC 54321
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
