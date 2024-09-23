"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import Loader from "@/components/Loader";
import InvestmentForm from "@/components/dashboards/InvestmentForm";
import InvestorProfile from "@/components/dashboards/InvestorProfile";
import InvestmentAnalytics from "@/components/dashboards/InvestmentAnalytics";
import NotificationsAlerts from "@/components/dashboards/NotificationsAndAlerts";
import EntrepreneurProfile from "@/components/dashboards/EntrepreneurProfile";
import ProposalsAnalytics from "@/components/dashboards/ProposalsAnalytics";
import Sidebar from "@/components/dashboards/SideNav";
import Messages from "@/components/dashboards/Messages";
import ProfileOverview from "@/components/dashboards/ProfileOverview";
import UpcomingEvents from "@/components/dashboards/UpcomingEvents";
import FeedbacksReceived from "@/components/dashboards/FeedbacksReceived";
import InterestManagement from "@/components/dashboards/InterestManagement";
import LatestNotifications from "@/components/LatestNotifications";
import {
  FaLightbulb,
  FaShieldAlt,
  FaComments,
  FaUserTie,
  FaChartLine,
  FaRegGem,
  FaHandsHelping,
  FaGlobe,
  FaRocket,
  FaAward,
  FaMedal,
} from "react-icons/fa";

export default function DashboardPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [form, setForm] = useState<{ [key: string]: any }>({});
  const [editing, setEditing] = useState<{ [key: string]: any }>({});
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    async function fetchUserRole() {
      try {
        const response = await fetch("/api/get-user-role");
        if (response.ok) {
          const data = await response.json();
          if (data.role === null) {
            router.push("/select-role");
            return;
          }
          setRole(data.role);
          fetchDashboardData(data.role);
        }
      } catch (error) {
        console.error("Failed to fetch user role", error);
      } finally {
        setLoading(false);
      }
    }

    async function fetchDashboardData(role: string) {
      try {
        const response = await fetch(`/api/${role.toLowerCase()}-dashboard`);
        if (response.ok) {
          const data = await response.json();
          setData(data);
        }
      } catch (error) {
        console.error(`Failed to fetch ${role} dashboard data`, error);
      }
    }

    fetchUserRole();
  }, [router]);

  const handleCreate = async (type: string, payload: any) => {
    try {
      const response = await fetch(`/api/${type}-create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const result = await response.json();
        setData((prevData: any) => ({
          ...prevData,
          [type]: [...(prevData[type] || []), result],
        }));
        toast.success(
          `${type.charAt(0).toUpperCase() + type.slice(1)} created successfully!`,
        );
      }
    } catch (error) {
      console.error(`Failed to create ${type}`, error);
      toast.error(`Failed to create ${type}.`);
    }
  };

  const handleUpdate = async (type: string, id: number, payload: any) => {
    try {
      const response = await fetch(`/api/${type}-update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const result = await response.json();
        setData((prevData: any) => ({
          ...prevData,
          [type]: prevData[type].map((item: any) =>
            item.id === id ? result : item,
          ),
        }));
        toast.success(
          `${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully!`,
        );
      }
    } catch (error) {
      console.error(`Failed to update ${type}`, error);
      toast.error(`Failed to update ${type}.`);
    }
  };

  const handleDelete = async (type: string, id: number) => {
    try {
      const response = await fetch(`/api/${type}-delete/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setData((prevData: any) => ({
          ...prevData,
          [type]: prevData[type].filter((item: any) => item.id !== id),
        }));
        toast.success(
          `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`,
        );
      }
    } catch (error) {
      console.error(`Failed to delete ${type}`, error);
      toast.error(`Failed to delete ${type}.`);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleEdit = (item: any) => {
    setEditing(item);
    setForm(item);
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
    type: string,
    id?: number,
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch(`/api/${type}-create`, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const result = await response.json();
        setData((prevData: any) => ({
          ...prevData,
          [type]: [...prevData[type], result],
        }));
        toast.success("Proposal submitted successfully!");
      } else {
        throw new Error("Failed to submit proposal");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error("An unknown error occurred.");
      }
    }
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/api/analytics");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setAnalytics(data.analytics);
      } catch (err) {
        setError("Failed to fetch analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  useEffect(() => {
    setTimeout(() => setLoading(false), 3000);
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (role === "INVESTOR") {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 dark:from-gray-900 dark:to-blue-900 text-gray-900 dark:text-white">
        <main className="flex flex-col items-center justify-center w-full h-full px-6 py-16 text-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <LatestNotifications />
        </main>
      </div>
    );
  } else if (role === "ENTREPRENEUR") {
    return (
      <div className="relative min-h-screen ">
        {/* Background Icons */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <FaGlobe className="text-blue-400 absolute bottom-28 right-14 text-[100px] rotate-12" />
          <FaAward className="text-orange-500 absolute bottom-10 left-32 text-[120px] rotate-6" />
        </div>
        <main className="flex flex-col items-center justify-center w-full h-full px-6 py-16 text-center">
          <EntrepreneurProfile
            data={data?.profile}
            onEdit={() => handleEdit(data?.profile)}
          />
          <LatestNotifications />
          <ProposalsAnalytics />
        </main>
      </div>
    );
  }

  const ideaIcon = (
    <svg
      width="50"
      height="50"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2C7.03 2 3 6.03 3 11C3 14.45 5.11 17.3 8 18.58V21C8 21.55 8.45 22 9 22H15C15.55 22 16 21.55 16 21V18.58C18.89 17.3 21 14.45 21 11C21 6.03 16.97 2 12 2ZM12 20H10V18H12V20ZM16 14H8C7.45 14 7 13.55 7 13V12C7 11.45 7.45 11 8 11H16C16.55 11 17 11.45 17 12V13C17 13.55 16.55 14 16 14Z"
        fill="#FFC107"
      />
    </svg>
  );

  // Feature Data with Colors and Icons
  const features = [
    {
      title: "Innovative Ideas",
      description: "Discover groundbreaking ideas from talented entrepreneurs.",
      icon: ideaIcon,
      color:
        "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-400",
    },
    {
      title: "Secure Transactions",
      description: "Ensure your investments are safe with secure processes.",
      icon: <FaShieldAlt className="text-blue-500 text-[40px]" />,
      color: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-400",
    },
    {
      title: "Effective Communication",
      description: "Connect easily with entrepreneurs and investors.",
      icon: <FaComments className="text-green-500 text-[40px]" />,
      color:
        "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400",
    },
    {
      title: "Expert Guidance",
      description: "Gain insights and mentorship from industry experts.",
      icon: <FaUserTie className="text-red-500 text-[40px]" />,
      color: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-400",
    },
    {
      title: "Real-Time Analytics",
      description: "Monitor your investments with real-time tools.",
      icon: <FaChartLine className="text-purple-500 text-[40px]" />,
      color:
        "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-400",
    },
    {
      title: "Customized Opportunities",
      description: "Receive tailored investment opportunities.",
      icon: <FaRegGem className="text-pink-500 text-[40px]" />,
      color: "bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-400",
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 dark:from-gray-900 dark:to-blue-900 text-gray-900 dark:text-white">
      {/* Background Icons */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <FaLightbulb className="text-yellow-500 absolute top-16 left-20 text-[100px] rotate-12" />
        <FaShieldAlt className="text-blue-500 absolute top-1/3 right-10 text-[120px] rotate-6" />
        <FaComments className="text-green-500 absolute bottom-16 left-1/4 text-[80px] -rotate-12" />
        <FaUserTie className="text-red-500 absolute top-1/4 left-10 text-[90px] rotate-45" />
        <FaChartLine className="text-purple-500 absolute bottom-20 right-1/3 text-[110px] -rotate-6" />
        <FaRegGem className="text-pink-500 absolute bottom-1/4 left-2/3 text-[100px] rotate-12" />

        <FaHandsHelping className="text-yellow-400 absolute top-20 right-5 text-[90px] rotate-12" />
        <FaGlobe className="text-blue-400 absolute bottom-28 right-14 text-[100px] rotate-12" />
        <FaRocket className="text-red-400 absolute top-1/3 left-14 text-[80px] rotate-45" />
        <FaAward className="text-orange-500 absolute bottom-10 left-32 text-[120px] rotate-6" />
        <FaMedal className="text-green-400 absolute top-10 right-32 text-[110px] -rotate-12" />
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center w-full h-full px-6 py-16 text-center">
        {/* Intro Section */}
        <section className="mb-12 mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-purple-500 to-blue-600 dark:from-yellow-400 dark:to-red-500 text-transparent bg-clip-text">
            Bridging Visionaries and Investors to Ignite Tomorrow&apos;s
            Innovations
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-8">
            Connect, innovate, and grow with Eagles Ring. Our platform brings
            together startups and investors to foster groundbreaking business
            ideas and opportunities.
          </p>
        </section>

        {/* Why Choose Section */}
        <section className="flex flex-col md:flex-row items-center gap-8 mb-12 max-w-5xl mx-auto">
          <div className="md:w-1/2">
            <Image
              src="/images/networking.svg"
              alt="Networking"
              width={600}
              height={400}
              className="w-full h-auto"
            />
          </div>
          <div className="md:w-1/2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4">
              Why Choose Eagles Ring?
            </h3>
            <p className="text-base sm:text-lg md:text-xl mb-6">
              At Eagles Ring, we provide a user-friendly platform for
              entrepreneurs to pitch their innovative ideas and for investors to
              find promising opportunities. Our mission is to facilitate
              meaningful connections that drive success.
            </p>
            <a
              href="/about"
              className="text-blue-500 dark:text-blue-300 font-semibold hover:underline text-lg transition-colors duration-300"
            >
              Learn More
            </a>
          </div>
        </section>

        {/* Video Section */}
        <section className="py-16 px-4 sm:px-8 lg:px-16 xl:px-24">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Connect, Invest, and Grow with Eagles Ring
            </h2>
            <p className="text-lg mb-10">
              Whether you&apos;re an entrepreneur seeking funding or an investor
              looking for the next big opportunity, Eagles Ring is your gateway
              to meaningful connections and successful partnerships.
            </p>
            <div className="relative shadow-2xl rounded-lg overflow-hidden">
              <video
                src="/Pitch-tut.mp4"
                className="w-full h-auto rounded-lg"
                controls
                preload="auto"
                autoPlay={false}
              >
                <track
                  src="/captions.vtt"
                  kind="captions"
                  srcLang="en"
                  label="English"
                  default
                />
                Your browser does not support the video tag.
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50 z-10 pointer-events-none"></div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative mb-12 w-full px-4">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-6">
            Our Features
          </h3>
          <div className="overflow-hidden w-full">
            <div className="flex flex-nowrap animate-scroll-features gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4 dark:bg-gray-800 bg-white border rounded-lg shadow-lg mr-4 last:mr-0"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h4 className="text-lg font-semibold mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
          <a
            href="/features"
            className="absolute right-0 p-2 text-blue-500 dark:text-blue-300 underline text-base transition-transform transform hover:scale-105"
          >
            View All
          </a>
        </section>

        {/* Call to Action Section */}
        <section className="mb-12 max-w-4xl mx-auto">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-6">
            Join Our Community
          </h3>
          <p className="text-base sm:text-lg md:text-xl mb-8">
            Become part of a growing community of innovators and investors. Sign
            up today and start making meaningful connections.
          </p>
          <a
            href="/sign-up"
            className="text-lg font-semibold rounded-lg px-4 py-2 transition-all duration-300 ease-in-out bg-gradient-to-r from-blue-400 to-blue-700 text-gray-100 shadow-lg hover:from-blue-500 hover:to-blue-800 dark:bg-gradient-to-r dark:from-blue-600 dark:to-blue-900 dark:text-gray-100 dark:hover:from-blue-700 dark:hover:to-blue-800 focus:outline-none"
          >
            Join Now
          </a>
        </section>
      </main>
    </div>
  );
}
