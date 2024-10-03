"use client";

import Loader from "@/components/Loader";
import { useRef, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import LoadingDots from "@/components/ui/LoadingDots"; // Import LoadingDots component

export default function SelectRole() {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => setLoading(false), 30000);
  }, []);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      setUserName(user?.fullName || "");
    } else {
      console.log("User not loaded or not signed in");
    }
  }, [isLoaded, isSignedIn, user]);

  const handleRoleAssignment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const roleName = formData.get("role") as "INVESTOR" | "ENTREPRENEUR";

    if (!roleName) {
      toast.info("Role is required");
      return;
    }

    if (window.confirm(`Do you want to save ${roleName} as your role? This cannot be changed.`)) {
      setIsSubmitting(true);

      try {
        const response = await fetch("/api/assign-role", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: roleName }),
        });

        if (response.ok) {
          const data = await response.json();
          toast.success(data.message);
          formRef.current?.reset();
          router.push("/role-assigned");
        } else {
          const errorData = await response.json();
          toast.error(errorData.error || "Failed to assign role");
        }
      } catch (error) {
        toast.error("Failed to assign role");
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="w-full  p-6 bg-gradient-to-br  from-gray-200 to-gray-100 dark:from-gray-900 dark:to-blue-900 h-screen rounded-xl shadow-lg space-y-10">
      <div className="mt-20">
        {isLoaded && isSignedIn && (
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 text-center">
            Welcome to Eagles Ring, <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-700 via-orange-600 to-blue-800 dark:from-yellow-400 dark:via-pink-500 dark:to-purple-500">
            {user.firstName} {user.lastName}
              </span>
          </h2>
        )}
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center">
          Select Your Role
        </h3>
        <p className="text-center text-gray-600 dark:text-gray-300">
          Choose your role to get started on your journey with us.
        </p>
        <form ref={formRef} onSubmit={handleRoleAssignment} className="space-y-4">
          <div className="relative">
            <select
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-md"
              id="role"
              name="role"
            >
              <option value="">Select role</option>
              <option value="INVESTOR">Investor</option>
              <option value="ENTREPRENEUR">Entrepreneur</option>
            </select>
          </div>
          <button
            className="mt-4 inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-lg text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700 dark:bg-green-600 dark:hover:bg-green-700"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? <LoadingDots /> : "Assign Role"}
          </button>
        </form>
      </div>
    </div>
  );
}
