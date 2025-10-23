"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import {} from "@nextui-org/user";
import {
  RangeCalendar,
  Card,
  User,
  Spacer,
  Skeleton,
  CardFooter,
} from "@nextui-org/react";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
} from "chart.js";
import EmptyState from "./EmptyState";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
);

interface Investment {
  id: number;
  amount: number;
  date: string;
  investorProfile: {
    id: number;
    imageUrl: string | null;
    linkedinUrl: string;
    user: {
      name: string;
      email: string;
    };
  };
  investmentOpportunity: {
    id: number;
    title: string;
    description: string;
  };
}

const EntrepreneurInvestments = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const response = await axios.get("/api/investments/entrepreneur");
        setInvestments(response.data);
      } catch (error) {
        setError("Unable to fetch investments.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-ZA").format(amount);
  };

  const totalInvestments = investments.reduce(
    (total, investment) => total + investment.amount,
    0,
  );

  const investmentData = investments.reduce(
    (acc, investment) => {
      const title =
        investment.investmentOpportunity.title || "Untitled Opportunity"; // Default title
      if (!acc[title]) {
        acc[title] = 0;
      }
      acc[title] += investment.amount;
      return acc;
    },
    {} as Record<string, number>,
  );

  const chartData = {
    labels: Object.keys(investmentData),
    datasets: [
      {
        label: "Investment Amount (R)",
        data: Object.values(investmentData),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
      },
    ],
  };

  const lineChartData = {
    labels: investments.map((investment) => formatDate(investment.date)),
    datasets: [
      {
        label: "Investment Over Time",
        data: investments.map((investment) => investment.amount),
        fill: false,
        backgroundColor: "rgba(75, 192, 192, 1)",
        borderColor: "rgba(75, 192, 192, 0.6)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-700 py-5 px-6">
      <div className="max-w-7xl mb-10 text-center mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          Investment Distribution
        </h2>
        <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Total Amount Received:{" "}
          <span className="text-green-700">
            R{formatAmount(totalInvestments)}
          </span>
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-8">
          <Card className="w-full md:w-1/2">
            <h3 className="text-lg font-bold bg-gray-900 dark:bg-gray-100 text-white dark:text-black">
              Investment Breakdown
            </h3>
            <div
              className="mb-5 bg-gray-100 dark:bg-gray-900 text-black dark:text-white"
              style={{ height: "300px" }}
            >
              {loading ? (
                <Skeleton className="h-full" />
              ) : (
                <Pie data={chartData} />
              )}
            </div>
          </Card>
          <Card className="w-full md:w-1/2">
            <h3 className="text-lg font-bold bg-gray-900 dark:bg-gray-100 text-white dark:text-black">
              Investment Over Time (in Rands)
            </h3>
            <div
              className="mb-5 bg-gray-100 dark:bg-gray-900 text-black dark:text-white"
              style={{ height: "300px" }}
            >
              {loading ? (
                <Skeleton className="h-full" />
              ) : (
                <Line data={lineChartData} />
              )}
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-60 rounded-lg" />
          ))
        ) : investments.length > 0 ? (
          investments.map((investment) => (
            <Card
              key={investment.id}
              className="relative bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8 border border-gray-200 dark:border-gray-700 transform hover:scale-105 hover:shadow-2xl transition-transform duration-300 ease-in-out"
            >
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-gradient-to-tr from-blue-500 to-green-400 dark:from-green-700 dark:to-blue-700 rounded-full flex items-center justify-center shadow-lg">
                  {investment.investorProfile.imageUrl ? (
                    <Image
                      src="/icon.png"
                      alt={`${investment.investorProfile.user.name}'s profile picture`}
                      width={50}
                      height={50}
                      className="rounded-full border border-gray-300 dark:border-gray-600"
                    />
                  ) : (
                    <span className="text-white font-bold text-2xl">
                      {investment.investorProfile.user.name.charAt(0)}
                    </span>
                  )}
                </div>
                <h4 className="text-center mt-4 text-gray-700 dark:text-gray-300 font-semibold">
                  Investor:{" "}
                  <span className="font-bold">
                    {investment.investorProfile.user.name || "Unknown Investor"}
                  </span>
                </h4>
                <p className="text-green-700 dark:text-green-400 font-semibold text-lg mt-1">
                  Amount: R{formatAmount(investment.amount)}
                </p>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-2">
                  {investment.investmentOpportunity.title ||
                    "No Title Available"}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-2 px-4">
                  {investment.investmentOpportunity.description ||
                    "No Description Available"}
                </p>
                <p className="text-blue-600 dark:text-blue-400 text-sm italic">
                  {formatDate(investment.date)}
                </p>
              </div>
            </Card>
          ))
        ) : (
          <EmptyState message="No investments found." />
        )}
      </div>
    </div>
  );
};

export default EntrepreneurInvestments;
