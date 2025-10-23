import { useState } from "react";
import { toast } from "react-toastify";
import VideoUploader from "./VideoUploader";
import LoadingDots from "./ui/LoadingDots";

const PitchForm = () => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);

    try {
      toast.success("Pitch submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit pitch");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="mb-4">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          required
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          required
        />
      </div>

      <VideoUploader />

      <button
        type="submit"
        className="mt-4 p-2 bg-gold text-white rounded-md"
        disabled={loading}
      >
        {loading ? <LoadingDots /> : "Submit Pitch"}
      </button>
    </form>
  );
};

export default PitchForm;
