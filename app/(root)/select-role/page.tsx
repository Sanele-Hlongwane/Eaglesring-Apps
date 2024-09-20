'use client';

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
    setTimeout(() => setLoading(false), 3000);
  }, []);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      setUserName(user?.fullName || '');
    } else {
      console.log('User not loaded or not signed in');
    }
  }, [isLoaded, isSignedIn, user]);

  const handleRoleAssignment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const roleName = formData.get('role') as 'INVESTOR' | 'ENTREPRENEUR';

    if (!roleName) {
      toast.error('Role is required');
      return;
    }

    if (window.confirm(`Do you want to save ${roleName} as your role? This cannot be changed.`)) {
      setIsSubmitting(true);

      try {
        const response = await fetch('/api/assign-role', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ role: roleName }),
        });

        if (response.ok) {
          const data = await response.json();
          toast.success(data.message);
          formRef.current?.reset();
          router.push('/role-assigned');
        } else {
          const errorData = await response.json();
          toast.error(errorData.error || 'Failed to assign role');
        }
      } catch (error) {
        toast.error('Failed to assign role');
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
    <div className="max-w-md mx-auto  my-20 p-6 bg-gray-400 dark:bg-gray-800 rounded-xl space-y-4">
      {isLoaded && isSignedIn && (
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Welcome to Eagles Ring, {userName}!
        </h2>
      )}
      <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Select Role</h3>
      <form ref={formRef} onSubmit={handleRoleAssignment}>
        <div className="relative">
          <select
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            id="role"
            name="role"
          >
            <option value="">Select role</option>
            <option value="INVESTOR">Investor</option>
            <option value="ENTREPRENEUR">Entrepreneur</option>
          </select>
        </div>
        <button
          className="mt-4 inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700 dark:bg-green-600 dark:hover:bg-green-700"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? <LoadingDots /> : 'Assign Role'}
        </button>
      </form>
    </div>
  );
}
