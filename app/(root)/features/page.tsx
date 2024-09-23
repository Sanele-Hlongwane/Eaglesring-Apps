"use client";

import { Link } from "@nextui-org/react";
import { FaInfoCircle, FaCheckCircle } from "react-icons/fa";
import { features } from "@/constants/features";

export default function FeaturesPage() {
  return (
    <div className="relative min-h-screen text-gray-900 dark:text-white">
      <main className="flex flex-col items-center justify-center w-full h-full px-6 py-16 text-center">
        <section className="mb-12 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-2xl md:text-4xl font-bold mb-4">
            Our Features
          </h1>
          <p className="text-base sm:text-sm md:text-lg mb-8">
            Explore the wide range of features designed to enhance your
            experience and success on Eagles Ring, whether you&apos;re an
            entrepreneur or an investor.
          </p>
        </section>

        <section className="relative mb-12 w-full px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="relative rounded-lg shadow-lg overflow-hidden bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600"
              >
                <div className="relative p-6 text-gray-900 dark:text-gray-100">
                  <h4 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-base mb-4">{feature.description}</p>
                  <ul className="list-disc list-inside mb-4">
                    {feature.details.map((detail, i) => (
                      <li key={i} className="text-sm flex items-center gap-2">
                        <FaCheckCircle className="text-green-500" /> {detail}
                      </li>
                    ))}
                  </ul>
                  <div className="absolute top-2 right-2">
                    <FaInfoCircle className="text-2xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12 max-w-4xl mx-auto">
          <h3 className="text-xl sm:text-lg md:text-2xl font-semibold mb-6">
            Get Started with Eagles Ring
          </h3>
          <p className="text-base sm:text-sm md:text-lg mb-8">
            Ready to take advantage of all these features? Sign up today and
            start your journey with us.
          </p>
          <Link
            href="/sign-up"
            className="text-lg font-semibold rounded-lg px-4 py-2 transition-all duration-300 ease-in-out bg-gradient-to-r from-blue-400 to-blue-700 text-gray-100 shadow-lg hover:from-blue-500 hover:to-blue-800 dark:bg-gradient-to-r dark:from-blue-600 dark:to-blue-800 dark:text-gray-100 dark:hover:from-blue-700 dark:hover:to-blue-900 focus:outline-none"
          >
            Sign Up Now
          </Link>
        </section>
      </main>
    </div>
  );
}
