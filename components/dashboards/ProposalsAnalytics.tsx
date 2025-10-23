import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface Pitch {
  id: number;
  title: string;
  description: string;
  createdAt: string;
}

interface Investment {
  amount: number;
  date: string;
}

interface Feedback {
  id: number;
  content: string;
  createdAt: string;
}

interface Interest {
  id: number;
  createdAt: string;
}

interface Analytics {
  pitchesCount: number;
  investmentsCount: number;
  feedbacksCount: number;
  interestsCount: number;
  pitches: Array<Pitch>;
  investments: Array<Investment>;
  feedbacks: Array<Feedback>;
  interests: Array<Interest>;
}

export default function ProposalsAnalytics() {
  const [data, setData] = useState<Analytics | null>(null);
  const [selectedPitch, setSelectedPitch] = useState<Pitch | null>(null);
  const router = useRouter();
  const [chartDimensions, setChartDimensions] = useState({
    width: 300,
    height: 300,
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/api/analytics");
        if (!response.ok) throw new Error("Network response was not ok");
        const result = await response.json();
        setData(result.analytics);
      } catch (error) {
        toast.error("Failed to load analytics data");
      }
    };
    fetchAnalytics();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const isSmallScreen = window.innerWidth < 768;
      setChartDimensions({
        width: isSmallScreen ? window.innerWidth - 80 : 768,
        height: isSmallScreen ? 200 : 400,
      });
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("no-scroll", !!selectedPitch);
  }, [selectedPitch]);

  const handlePitchClick = (pitch: Pitch) => setSelectedPitch(pitch);
  const handleCloseOverlay = () => setSelectedPitch(null);
  const handleViewAllPitches = () => router.push("/pitches");

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString();

  const prepareChartData = (
    items: any[],
    dateKey: string,
    countKey: string,
  ) => {
    const groupedData = items.reduce((acc: { [key: string]: number }, item) => {
      const date = formatDate(item[dateKey]);
      acc[date] = (acc[date] || 0) + (item[countKey] || 1);
      return acc;
    }, {});
    return Object.entries(groupedData).map(([date, count]) => ({
      date,
      count,
    }));
  };

  const pitchesData = prepareChartData(
    data?.pitches || [],
    "createdAt",
    "count",
  );
  const investmentsData = prepareChartData(
    data?.investments || [],
    "date",
    "amount",
  );
  const feedbacksData = prepareChartData(
    data?.feedbacks || [],
    "createdAt",
    "count",
  );
  const interestsData = prepareChartData(
    data?.interests || [],
    "createdAt",
    "count",
  );

  const tooltipStyle = {
    backgroundColor: "#333",
    border: "1px solid #666",
    color: "#fff",
    fontSize: "14px",
    padding: "10px",
    borderRadius: "4px",
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-full md:max-w-7xl mx-auto py-6 md:py-10">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-6 md:mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-yellow-400">
          Pitches Analytics
        </h2>

        {data ? (
          <div className="space-y-6 md:space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {[
                { label: "Total Pitches", value: data.pitchesCount },
                { label: "Total Investments", value: data.investmentsCount },
                { label: "Total Feedbacks", value: data.feedbacksCount },
                { label: "Total Interests", value: data.interestsCount },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-4 md:p-6 rounded-lg shadow-xl border border-gray-200 bg-white dark:bg-gray-800"
                >
                  <p className="text-xl md:text-xl font-semibold text-gray-700 dark:text-gray-300">
                    {stat.label}
                  </p>
                  <p className="text-3xl md:text-4xl font-bold text-gold-500">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-center mb-4 md:mb-6">
                Detailed Analytics
              </h3>
              <div className="space-y-6">
                {/* Pitches Trend */}
                <div className="p-4 md:p-6 rounded-lg shadow-xl border border-gray-200 bg-white dark:bg-gray-800">
                  <h4 className="text-xl md:text-2xl font-semibold mb-4">
                    Pitches Over Time
                  </h4>
                  <LineChart
                    width={chartDimensions.width}
                    height={chartDimensions.height}
                    data={pitchesData}
                    className="w-full"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" />
                    <Legend />
                  </LineChart>
                </div>

                {/* Investments Chart */}
                <div className="p-4 md:p-6 rounded-lg shadow-xl border border-gray-200 bg-white dark:bg-gray-800">
                  <h4 className="text-xl md:text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
                    Investments Over Time
                  </h4>
                  <BarChart
                    width={chartDimensions.width}
                    height={chartDimensions.height}
                    data={investmentsData}
                    className="w-full"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend />
                    <Bar dataKey="amount" fill="#82ca9d" />
                  </BarChart>
                </div>

                {/* Feedbacks Trend */}
                <div className="p-4 md:p-6 rounded-lg shadow-xl border border-gray-200 bg-white dark:bg-gray-800">
                  <h4 className="text-xl md:text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
                    Feedbacks Over Time
                  </h4>
                  <LineChart
                    width={chartDimensions.width}
                    height={chartDimensions.height}
                    data={feedbacksData}
                    className="w-full"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Line type="monotone" dataKey="count" stroke="#ff7300" />
                    <Legend />
                  </LineChart>
                </div>

                {/* Interests Trend */}
                <div className="p-4 md:p-6 rounded-lg shadow-xl border border-gray-200 bg-white dark:bg-gray-800">
                  <h4 className="text-xl md:text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
                    Interests Over Time
                  </h4>
                  <LineChart
                    width={chartDimensions.width}
                    height={chartDimensions.height}
                    data={interestsData}
                    className="w-full"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Line type="monotone" dataKey="count" stroke="#387908" />
                    <Legend />
                  </LineChart>
                </div>
              </div>
            </div>

            <div className="text-center mt-6">
              <button
                onClick={handleViewAllPitches}
                className="bg-gold-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-gold-600 transition duration-300"
              >
                View All Pitches
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-48">
            <Loader />
          </div>
        )}

        {selectedPitch && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg mx-auto shadow-lg">
              <h3 className="text-xl font-bold mb-4">{selectedPitch.title}</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {selectedPitch.description}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Created At: {formatDate(selectedPitch.createdAt)}
              </p>
              <button
                onClick={handleCloseOverlay}
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
