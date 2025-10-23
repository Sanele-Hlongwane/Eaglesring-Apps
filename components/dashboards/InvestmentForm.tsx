"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Pusher from "pusher-js";
import Loader from "@/components/Loader";

interface Investment {
  id: number;
  title: string;
  description: string;
  createdAt: string;
}

interface InvestmentFormProps {
  form: {
    title: string;
    description: string;
  };
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

interface PusherEvent {
  investment: Investment;
}

export default function InvestorsPage() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [selectedInvestment, setSelectedInvestment] =
    useState<Investment | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newInvestment, setNewInvestment] = useState<{
    title: string;
    description: string;
  }>({
    title: "",
    description: "",
  });
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [expandedInvestmentId, setExpandedInvestmentId] = useState<
    number | null
  >(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInvestments() {
      try {
        const response = await fetch("/api/investments");
        if (!response.ok) {
          throw new Error("Failed to load investments");
        }
        const result = await response.json();
        setInvestments(result.investments);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to load investments";
        toast.error(errorMessage);
      }
    }

    fetchInvestments();
  }, []);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe("my-channel");
    channel.bind("update", (data: any) => {
      console.log("Event received:", data); // Log data to see if the event is triggered
    });

    return () => {
      pusher.unsubscribe("my-channel");
    };
  }, []);

  useEffect(() => {
    setTimeout(() => setLoading(false), 3000);
  }, []);

  if (loading) {
    return <Loader />;
  }

  const handleCreate = async () => {
    try {
      const response = await fetch("/api/investments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newInvestment),
      });
      if (!response.ok) {
        throw new Error("Failed to create investment");
      }
      const result = await response.json();
      setNewInvestment({ title: "", description: "" });
      setIsCreating(false);
      toast.success("Investment created successfully");
      window.location.reload();
      router.refresh(); // Refresh the page
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create investment";
      toast.error(errorMessage);
    }
  };

  const handleUpdate = async () => {
    if (!selectedInvestment) return;

    try {
      const response = await fetch(
        `/api/investments/${selectedInvestment.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(selectedInvestment),
        },
      );

      if (!response.ok) {
        const errorMessage = await response.text(); // Get error message from the response
        throw new Error(errorMessage || "Failed to update investment");
      }

      setSelectedInvestment(null);
      setIsEditing(false);
      toast.success("Investment updated successfully");
      window.location.reload();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update investment";
      setSelectedInvestment(null);
      setIsEditing(false);
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/investments/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete investment");
      }
      setInvestments(investments.filter((investment) => investment.id !== id));
      toast.success("Investment deleted successfully");
      router.refresh(); // Refresh the page
      window.location.reload();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete investment";
      toast.error(errorMessage);
    }
  };

  const handleEditClick = (investment: Investment) => {
    setSelectedInvestment(investment);
    setIsEditing(true);
  };

  const handleViewDetails = (id: number) => {
    setExpandedInvestmentId(id === expandedInvestmentId ? null : id);
  };

  const handleCloseOverlay = () => {
    setSelectedInvestment(null);
    setIsEditing(false);
    setIsCreating(false);
  };

  return (
    <div className="max-w-full px-6 py-8 mx-auto">
      <div className="max-w-7xl mx-auto py-10">
        <h2 className="text-4xl font-extrabold mb-8 text-center">
          Investments Management
        </h2>

        {/* Create Investment Button */}
        <div className="mb-8 text-center">
          <button
            onClick={() => setIsCreating(true)}
            className="px-6 py-3 rounded-full shadow-lg bg-gradient-to-r from-green-400 to-green-600 text-white hover:opacity-90 transition-opacity duration-300"
          >
            Add New Investment
          </button>
        </div>

        {/* Investments List */}
        <div>
          <h3 className="text-3xl font-bold mb-6">Investments</h3>
          <ul className="space-y-4">
            {investments.length > 0 ? (
              investments.map((investment) => (
                <li
                  key={investment.id}
                  className="border rounded-lg p-4 shadow-sm"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-xl font-semibold">
                        {investment.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-200">
                        {new Date(investment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleViewDetails(investment.id)}
                        className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 text-white hover:opacity-90 transition-opacity duration-300"
                      >
                        {expandedInvestmentId === investment.id
                          ? "Hide"
                          : "View"}
                      </button>
                      <button
                        onClick={() => handleEditClick(investment)}
                        className="px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white hover:opacity-90 transition-opacity duration-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(investment.id)}
                        className="px-4 py-2 rounded-full bg-gradient-to-r from-red-400 to-red-600 text-white hover:opacity-90 transition-opacity duration-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  {expandedInvestmentId === investment.id && (
                    <div className="mt-4 p-4 border-t border-gray-200">
                      <h5 className="text-lg font-semibold">Description</h5>
                      <p className="text-gray-800 dark:text-gray-200">
                        {investment.description}
                      </p>
                    </div>
                  )}
                </li>
              ))
            ) : (
              <p className="text-lg text-gray-400">No investments available.</p>
            )}
          </ul>
        </div>
      </div>

      {/* Create Investment Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-100 dark:bg-gray-900 p-8 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Create New Investment</h3>
            <input
              type="text"
              placeholder="Title"
              value={newInvestment.title}
              onChange={(e) =>
                setNewInvestment({ ...newInvestment, title: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <textarea
              placeholder="Description"
              value={newInvestment.description}
              onChange={(e) =>
                setNewInvestment({
                  ...newInvestment,
                  description: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-300 rounded mb-4"
              rows={4}
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCreate}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-green-400 to-green-600 text-white hover:opacity-90 transition-opacity duration-300"
              >
                Create
              </button>
              <button
                onClick={handleCloseOverlay}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-gray-400 to-gray-600 text-white hover:opacity-90 transition-opacity duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Investment Modal */}
      {isEditing && selectedInvestment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-100 dark:bg-gray-900 p-8 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Edit Investment</h3>
            <input
              type="text"
              placeholder="Title"
              value={selectedInvestment.title}
              onChange={(e) =>
                setSelectedInvestment({
                  ...selectedInvestment,
                  title: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <textarea
              placeholder="Description"
              value={selectedInvestment.description}
              onChange={(e) =>
                setSelectedInvestment({
                  ...selectedInvestment,
                  description: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-300 rounded mb-4"
              rows={4}
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleUpdate}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white hover:opacity-90 transition-opacity duration-300"
              >
                Save Changes
              </button>
              <button
                onClick={handleCloseOverlay}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-gray-400 to-gray-600 text-white hover:opacity-90 transition-opacity duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
