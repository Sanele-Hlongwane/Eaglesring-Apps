"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import Loader from "@/components/Loader";
import InvestmentForm from '@/components/dashboards/InvestmentForm';
import InvestorProfile from '@/components/dashboards/InvestorProfile';
import InvestmentAnalytics from '@/components/dashboards/InvestmentAnalytics';
import NotificationsAlerts from '@/components/dashboards/NotificationsAndAlerts';
import EntrepreneurProfile from '@/components/dashboards/EntrepreneurProfile';
import ProposalsAnalytics from '@/components/dashboards/ProposalsAnalytics';
import Sidebar from "@/components/dashboards/SideNav";
import Messages from '@/components/dashboards/Messages';
import ProfileOverview from '@/components/dashboards/ProfileOverview';
import UpcomingEvents from '@/components/dashboards/UpcomingEvents';
import FeedbacksReceived from '@/components/dashboards/FeedbacksReceived';
import InterestManagement from '@/components/dashboards/InterestManagement';

export default function DashboardPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [form, setForm] = useState<{ [key: string]: any }>({});
  const [editing, setEditing] = useState<{ [key: string]: any }>({});
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    async function fetchUserRole() {
      try {
        const response = await fetch('/api/get-user-role');
        if (response.ok) {
          const data = await response.json();
          if (data.role === null) {
            router.push('/select-role');
            return;
          }
          setRole(data.role);
          fetchDashboardData(data.role);
        }
      } catch (error) {
        console.error('Failed to fetch user role', error);
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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const result = await response.json();
        setData((prevData: any) => ({
          ...prevData,
          [type]: [...(prevData[type] || []), result],
        }));
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} created successfully!`);
      }
    } catch (error) {
      console.error(`Failed to create ${type}`, error);
      toast.error(`Failed to create ${type}.`);
    }
  };

  const handleUpdate = async (type: string, id: number, payload: any) => {
    try {
      const response = await fetch(`/api/${type}-update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const result = await response.json();
        setData((prevData: any) => ({
          ...prevData,
          [type]: prevData[type].map((item: any) =>
            item.id === id ? result : item
          ),
        }));
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully!`);
      }
    } catch (error) {
      console.error(`Failed to update ${type}`, error);
      toast.error(`Failed to update ${type}.`);
    }
  };

  const handleDelete = async (type: string, id: number) => {
    try {
      const response = await fetch(`/api/${type}-delete/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setData((prevData: any) => ({
          ...prevData,
          [type]: prevData[type].filter((item: any) => item.id !== id),
        }));
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`);
      }
    } catch (error) {
      console.error(`Failed to delete ${type}`, error);
      toast.error(`Failed to delete ${type}.`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>, type: string, id?: number) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch(`/api/${type}-create`, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const result = await response.json();
        setData((prevData: any) => ({
          ...prevData,
          [type]: [...prevData[type], result],
        }));
        toast.success('Proposal submitted successfully!');
      } else {
        throw new Error('Failed to submit proposal');
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error('An unknown error occurred.');
      }
    }
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/analytics');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAnalytics(data.analytics);
      } catch (err) {
        setError('Failed to fetch analytics');
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
      return < Loader />;
  }

  if (role === 'INVESTOR') {
    return (
      <div className="relative min-h-screen text-gray-900 dark:text-white">
      <main className="flex flex-col items-center justify-center w-full h-full px-6 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Investor Dashboard</h1>
        <p className="text-xl mb-8">
          Welcome to your investor dashboard! Here you can find potential startups to invest in.
        </p>
      </main>
    </div>
    );
  } else if (role === 'ENTREPRENEUR') {
    return (
      <div className="relative min-h-screen ">
        <main className="flex flex-col items-center justify-center w-full h-full px-6 py-16 text-center">
        <EntrepreneurProfile data={data?.profile} onEdit={() => handleEdit(data?.profile)} />
        <ProposalsAnalytics />
        <NotificationsAlerts alerts={data?.alerts} />
          
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-gray-900 dark:text-white">
      <main className="flex flex-col items-center justify-center w-full h-full px-6 py-16 text-center">
  <section className="mb-12 max-w-4xl mx-auto">
    <h1 className="text-3xl sm:text-2xl md:text-4xl font-bold mb-4">
      Connecting entrepreneurs with world-class investors to create a brighter future.
    </h1>
    <p className="text-base sm:text-sm md:text-lg mb-8">
      Connect, innovate, and grow with Eagles Ring. Our platform brings together startups and investors to foster groundbreaking business ideas and opportunities.
    </p>
    <a
      href="/sign-up"
      className="text-lg font-semibold rounded-lg px-4 py-2 transition-all duration-300 ease-in-out bg-gradient-to-r from-blue-400 to-blue-700 text-gray-100 shadow-lg hover:from-blue-500 hover:to-blue-800 dark:bg-gradient-to-r dark:from-blue-600 dark:to-blue-900 dark:text-gray-100 dark:hover:from-blue-700 dark:hover:to-blue-800 focus:outline-none"
    >
      Join Now
    </a>
  </section>

  <section className="flex flex-col md:flex-row items-center gap-8 mb-12 max-w-4xl mx-auto">
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
      <h3 className="text-xl sm:text-lg md:text-2xl font-semibold mb-4">Why Choose Eagles Ring?</h3>
      <p className="text-base sm:text-sm md:text-lg mb-6">
        At Eagles Ring, we provide a user-friendly platform for entrepreneurs to pitch their innovative ideas and for investors to find promising opportunities. Our mission is to facilitate meaningful connections that drive success.
      </p>
      <a
        href="/about"
        className="text-blue-500 dark:text-blue-300 font-semibold hover:underline text-sm sm:text-xs md:text-sm lg:text-base transition-colors duration-300"
      >
        Learn More
      </a>
    </div>
  </section>

  <section className="relative mb-12 w-full px-4">
    <h3 className="text-xl sm:text-lg md:text-2xl font-semibold mb-6">Our Features</h3>
    <div className="overflow-hidden w-full">
      <div className="flex flex-nowrap animate-scroll-features">
        <div className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4 sm:p-3 md:p-6 dark:bg-gray-800 border rounded-lg shadow-lg mr-4 last:mr-0">
          <h4 className="text-base sm:text-sm md:text-lg font-semibold mb-2">Innovative Ideas</h4>
          <p className="text-sm sm:text-xs md:text-base">
            Discover groundbreaking ideas from talented entrepreneurs looking to make an impact.
          </p>
        </div>
        <div className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4 sm:p-3 md:p-6 dark:bg-gray-800 border rounded-lg shadow-lg mr-4 last:mr-0">
          <h4 className="text-base sm:text-sm md:text-lg font-semibold mb-2">Secure Transactions</h4>
          <p className="text-sm sm:text-xs md:text-base">
            Ensure your investments are safe with our secure and transparent transaction processes.
          </p>
        </div>
        <div className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4 sm:p-3 md:p-6 dark:bg-gray-800 border rounded-lg shadow-lg mr-4 last:mr-0">
          <h4 className="text-base sm:text-sm md:text-lg font-semibold mb-2">Effective Communication</h4>
          <p className="text-sm sm:text-xs md:text-base">
            Connect easily with entrepreneurs and investors through our integrated communication tools.
          </p>
        </div>
        <div className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4 sm:p-3 md:p-6 dark:bg-gray-800 border rounded-lg shadow-lg mr-4 last:mr-0">
          <h4 className="text-base sm:text-sm md:text-lg font-semibold mb-2">Expert Guidance</h4>
          <p className="text-sm sm:text-xs md:text-base">
            Gain insights and mentorship from industry experts to refine your business strategy.
          </p>
        </div>
        <div className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4 sm:p-3 md:p-6 dark:bg-gray-800 border rounded-lg shadow-lg mr-4 last:mr-0">
          <h4 className="text-base sm:text-sm md:text-lg font-semibold mb-2">Real-Time Analytics</h4>
          <p className="text-sm sm:text-xs md:text-base">
            Monitor your investments and performance with real-time analytics and reporting tools.
          </p>
        </div>
        <div className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4 sm:p-3 md:p-6 dark:bg-gray-800 border rounded-lg shadow-lg mr-4 last:mr-0">
          <h4 className="text-base sm:text-sm md:text-lg font-semibold mb-2">Customized Opportunities</h4>
          <p className="text-sm sm:text-xs md:text-base">
            Receive tailored investment opportunities that match your interests and goals.
          </p>
        </div>
      </div>
    </div>
    <a
      href="/features"
      className="absolute  right-0 p-2 text-blue-500 dark:text-blue-300 underline text-sm sm:text-xs md:text-sm lg:text-base transition-transform transform hover:scale-105"
    >
      View All
    </a>
  </section>

  <section className="mb-12 max-w-4xl mx-auto">
    <h3 className="text-xl sm:text-lg md:text-2xl font-semibold mb-6">Join Our Community</h3>
    <p className="text-base sm:text-sm md:text-lg mb-8">
      Become part of a growing community of innovators and investors. Sign up today and start making meaningful connections.
    </p>
    <a
      href="/sign-up"
      className="text-lg font-semibold rounded-lg px-4 py-2 transition-all duration-300 ease-in-out bg-gradient-to-r from-blue-400 to-blue-700 text-gray-100 shadow-lg hover:from-blue-500 hover:to-blue-800 dark:bg-gradient-to-r dark:from-blue-600 dark:to-blue-900 dark:text-gray-100 dark:hover:from-blue-700 dark:hover:to-blue-800 focus:outline-none"
    >
      Get Started
    </a>
  </section>
</main>

    </div>
  );
}

