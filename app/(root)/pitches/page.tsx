"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Pusher from "pusher-js";
import { v4 as uuidv4 } from "uuid";
import supabase from "@/lib/supabaseClient";
import { FaCalendarAlt, FaDownload, FaMapMarkerAlt, FaMoneyBillWave, FaTimes, FaVideo } from "react-icons/fa";
import LoadingDots from "@/components/ui/LoadingDots";
import EmptyState from "@/components/EmptyState";

interface Pitch {
  updatedAt: string;
  id: number;
  title: string;
  description: string;
  createdAt: string;
  videoUrl?: string;
  attachments?: string[];
  fundingGoal?: number;
}

interface PusherEvent {
  pitch: Pitch;
}

export default function PitchesPage() {
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [selectedPitch, setSelectedPitch] = useState<Pitch | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newPitch, setNewPitch] = useState<Omit<Pitch, 'id' | 'createdAt'> & { videoFile?: File; pitchDeckFile?: File }>({
    title: "",
    description: "",
    fundingGoal: undefined, 
    updatedAt: new Date().toISOString(),
  });
  
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [expandedPitchId, setExpandedPitchId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchPitches() {
      try {
        const response = await fetch("/api/create-pitch");
        if (!response.ok) {
          throw new Error("Failed to load pitches");
        }
        const result = await response.json();
        setPitches(result.pitches);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to load pitches";
        toast.error(errorMessage);
      }
    }

    fetchPitches();
  }, []);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe('my-channel');
    channel.bind('update', (data: any) => {
      console.log('Event received:', data);
    });

    return () => {
      pusher.unsubscribe('my-channel');
    };
  }, []);

  const uploadFile = async (file: File, path: string): Promise<string> => {
    const { data: uploadData, error: uploadError } = await supabase.storage.from('video').upload(path, file);
    if (uploadError) {
      throw new Error(`Failed to upload file: ${uploadError.message}`);
    }
    const { data: urlData } = supabase.storage.from('video').getPublicUrl(path);
    if (!urlData?.publicUrl) {
      throw new Error("Failed to get public URL");
    }
    return urlData.publicUrl;
  };

  const handleCreate = async () => {
    setLoading(true); // Start loading
    try {
      let videoUrl = "";
      if (videoFile) {
        const videoPath = `videos/${uuidv4()}_${videoFile.name}`;
        videoUrl = await uploadFile(videoFile, videoPath);
      }

      const attachmentUrls: string[] = [];
      for (const file of attachmentFiles) {
        const attachmentPath = `attachments/${uuidv4()}_${file.name}`;
        const attachmentUrl = await uploadFile(file, attachmentPath);
        attachmentUrls.push(attachmentUrl);
      }

      const response = await fetch("/api/create-pitch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...newPitch, videoUrl, attachments: attachmentUrls }),
      });
      if (!response.ok) {
        throw new Error("Failed to create pitch");
      }
      const result = await response.json();
      setNewPitch({
        title: "",
        description: "",
        fundingGoal: undefined,
        updatedAt: new Date().toISOString(),
      });
      setVideoFile(null);
      setAttachmentFiles([]);
      toast.success("Pitch created successfully");
      setLoading(false); 
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create pitch";
      toast.error(errorMessage);
      setLoading(false); 
    }
  };

  const handleUpdate = async (id: number) => {
    if (!selectedPitch) return;
    setLoading(true);

    try {
      const response = await fetch(`/api/create-pitch/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: selectedPitch.title,
          description: selectedPitch.description,
          fundingGoal: selectedPitch.fundingGoal,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Failed to update pitch");
      }

      setPitches((prevPitches) => 
        prevPitches.map((pitch) => 
          pitch.id === id ? { ...pitch, ...selectedPitch } : pitch
        )
      );

      setSelectedPitch(null);
      setIsEditing(false);
      toast.success("Pitch updated successfully");
      setLoading(false);
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update pitch";
      setSelectedPitch(null);
      setIsEditing(false);
      setLoading(false);
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true); 
      const response = await fetch(`/api/create-pitch/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete pitch");
      }
      setPitches(pitches.filter((pitch) => pitch.id !== id));
      toast.success("Pitch deleted successfully");
      setLoading(false); 
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete pitch";
      setLoading(false); 
      toast.error(errorMessage);
    }
  };

  const handleViewDetails = (id: number) => {
    setExpandedPitchId(id === expandedPitchId ? null : id);
  };

  return (
    <div className="min-h-screen text-sm ">
      <div className="max-w-7xl mx-auto">
        <div className="fixed inset-x-0 top-16 z-10 flex flex-col items-center space-y-4 bg-white dark:bg-gray-800 p-4 shadow-lg">
          <div className="flex justify-end w-full">
            <a
              href="/profile"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
            >
              Edit Profile
            </a>
          </div>
          <div className="flex justify-center mb-8 space-x-4">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-3 rounded-md border border-transparent bg-gradient-to-r from-gray-200 to-gray-300 dark:bg-gradient-to-r dark:from-gray-600 dark:to-gray-800 ${activeTab === "overview" ? "text-gray-800 dark:text-gray-200 bg-opacity-90 shadow-lg shadow-blue-500/50" : "text-gray-700 dark:text-gray-300 bg-opacity-80 hover:bg-gray-300 dark:hover:bg-gray-600"} focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all duration-300`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("add")}
              className={`px-6 py-3 rounded-md border border-transparent bg-gradient-to-r from-gray-200 to-gray-300 dark:bg-gradient-to-r dark:from-gray-600 dark:to-gray-800 ${activeTab === "add" ? "text-gray-800 dark:text-gray-200 bg-opacity-90 shadow-lg shadow-blue-500/50" : "text-gray-700 dark:text-gray-300 bg-opacity-80 hover:bg-gray-300 dark:hover:bg-gray-600"} focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all duration-300`}
            >
              Add Pitch
            </button>
          </div>
        </div>

        <div className="pt-40 pb-10"> 
        {activeTab === "overview" && (
          <div className="p-6 rounded-lg">
            {/* Pitches List */}
            <ul className="space-y-4">
              {pitches.length > 0 ? (
                pitches.map((pitch) => (
                  <li
                    key={pitch.id}
                    className="border dark:border-gray-700 rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                      {isEditing && selectedPitch?.id === pitch.id ? (
                        // Edit Form
                        <div className="p-6 rounded-lg w-full">
                          <h3 className="text-3xl font-bold mb-6">Edit Pitch</h3>
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleUpdate(pitch.id);
                            }}
                            className="space-y-6"
                          >
                            <div className="relative">
                              <button
                                onClick={() => setIsEditing(false)}
                                className="absolute top-[-90px] right-[-30px] text-red-500 dark:text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                              >
                                <FaTimes size={24} />
                              </button>
                            <div className="flex flex-col md:flex-row md:space-x-6">
                              <div className="w-full">
                              <label htmlFor="title" className="block text-gray-700 dark:text-gray-200">
                                Title
                              </label>
                              <input
                                id="title"
                                type="text"
                                className="mt-1 p-2 border rounded"
                              />
                                <input
                                  type="text"
                                  value={selectedPitch?.title || ""}
                                  onChange={(e) =>
                                    setSelectedPitch({
                                      ...selectedPitch,
                                      title: e.target.value,
                                    })
                                  }
                                  className="border p-2 rounded w-full bg-gray-100 dark:bg-gray-700"
                                  required
                                />
                              </div>
                              <div className="w-full">
                                <div className="mt-4">
                                <label htmlFor="fundingGoal" className="block text-lg font-semibold text-gray-700 dark:text-gray-300">
  Funding Goal (in ZAR)
</label>
<input
  id="fundingGoal"
  type="number" // or "text" depending on your use case
  className="mt-1 p-2 border rounded"
/>
<input
                                    type="number"
                                    value={selectedPitch?.fundingGoal || ""}
                                    onChange={(e) =>
                                      setSelectedPitch({
                                        ...selectedPitch,
                                        fundingGoal: parseFloat(e.target.value),
                                      })
                                    }
                                    placeholder="Enter funding goal"
                                    className="mt-3 p-4 w-full border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-gray-100 dark:bg-gray-800 focus:ring-4 focus:ring-green-400 dark:focus:ring-green-500"
                                    required
                                  />
                                </div>
                              </div>
                            </div>

                            <div>
                              <label className="block text-gray-700 dark:text-gray-200">
                                Description
                              </label>
                              <textarea
                                id="pitchDescription" // Add this line
                                value={selectedPitch?.description || ""}
                                onChange={(e) =>
                                  setSelectedPitch({
                                    ...selectedPitch,
                                    description: e.target.value,
                                  })
                                }
                                className="border p-2 rounded w-full bg-gray-100 dark:bg-gray-700"
                                required
                              />
                            </div>

                            {/* Read-Only Video Section */}
                            <div>
                            <label className="block text-gray-700 dark:text-gray-200">
  Video (view only)
</label>
{pitch.videoUrl ? (
  <div className="mt-2">
    <video
      src={pitch.videoUrl}
      controls
      className="w-full max-w-full rounded-lg border border-gray-300 dark:border-gray-700"
      style={{ maxHeight: "500px" }}
    >
      <track kind="captions" srcLang="en" />
    </video>
    <p className="text-gray-500 dark:text-gray-400 mt-2">
      You cannot edit the video. To change it, delete the pitch and create a new one.
    </p>
  </div>
) : (
  <p className="text-gray-500 dark:text-gray-400">
    No video available.
  </p>
)}

                            </div>

                            {/* Read-Only Attachments Section */}
                            <div>
                              <label className="block text-gray-700 dark:text-gray-200">
                                Attachments (view only)
                              </label>
                              {pitch.attachments && pitch.attachments.length > 0 ? (
  <div className="mt-2">
    <ul role="list" className="space-y-3">
      {pitch.attachments.map((attachment, index) => (
        <li key={index} className="flex items-center space-x-2">
          <FaDownload className="text-blue-600" />
          <a
            href={attachment}
            download
            className="text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 font-medium transition-colors duration-300"
            aria-label={`Download ${attachment.split("/").pop()}`}
          >
            {attachment.split("/").pop()}
          </a>
        </li>
      ))}
    </ul>
    <p className="text-gray-500 dark:text-gray-400 mt-2">
      You cannot edit the attachments. To change them, delete the pitch and create a new one.
    </p>
  </div>
) : (
  <p className="text-gray-500 dark:text-gray-400">
    No attachments available.
  </p>
)}

                            </div>
                            </div>

                            {/* Save/Cancel Buttons */}
                            <div>
                              <button
                                type="submit"
                                disabled={loading}
                                className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors ${loading ? "cursor-not-allowed" : ""}`}
                              >
                              {loading ? <LoadingDots /> : "Save"}
                             </button>
                              <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="bg-gray-500 text-white px-4 py-2 rounded ml-4 hover:bg-gray-600 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        </div>
                      ) : (
                        <>
                          <div className="p-6 rounded-lg flex-grow">
                            <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-2">
                              {pitch.title}
                            </h4>
                            <div className="text-sm text-gray-600 dark:text-gray-400 flex flex-wrap items-center">
                              <span className="flex items-center mr-4">
                                <FaCalendarAlt className="mr-1" />
                                Last edited:{" "}
                                {new Date(pitch.updatedAt).toLocaleString()}
                              </span>
                              <span className="flex items-center mr-4 p-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg shadow-md">
                                <FaMoneyBillWave className="mr-2 text-green-600 dark:text-green-400" />
                                <span className="font-semibold">Funding Goal:</span>
                                <span className="ml-2">
                                  R{pitch.fundingGoal?.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4 md:mt-0">
                            <button
                              onClick={() => {
                                setSelectedPitch(pitch);
                                setIsEditing(true);
                              }}
                              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(pitch.id)}
                              disabled={loading}
                              className={`bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors  ${loading ? "cursor-not-allowed" : ""}`}
                            >
                             {loading ? <LoadingDots /> : "Delete"}
                            </button>
                            <button
                              onClick={() => handleViewDetails(pitch.id)}
                              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                            >
                              {expandedPitchId === pitch.id
                                ? "Hide Details"
                                : "View Details"}
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Expandable Details Section */}
                    {expandedPitchId === pitch.id && !isEditing && (
                      <div className="mt-6  lg:p-8 max-w-xm mx-auto rounded-lg">
                        {/* Pitch Details */}
                        <p className="text-gray-900 dark:text-gray-100 text-xl font-bold mb-4">
                          Details for:{" "}
                          <span className="text-indigo-600">{pitch.title}</span>
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 whitespace-pre-line">
                          {pitch.description }
                        </p>
                        {/* Video Section */}
                        {pitch.videoUrl && (
  <div className="mb-6">
    <video
      src={pitch.videoUrl}
      controls
      className="w-full max-w-full rounded-lg border border-gray-300 dark:border-gray-700"
      style={{ maxHeight: "500px" }}
    >
      <track
        kind="captions"
        srcLang="en"
        label="English"
        src="/path/to/captions.vtt" // Replace with your actual caption file path
        default
      />
      Your browser does not support the video tag.
    </video>
    <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center mt-2">
      <FaVideo className="mr-2" /> Video Preview
    </p>
  </div>
)}


                        {/* Attachments Section */}
                        {pitch.attachments && pitch.attachments.length > 0 && (
                          <div className="mt-6">
                            <p className="text-gray-900 dark:text-gray-100 text-xl font-semibold mb-3 flex items-center">
                              <FaDownload className="mr-2" /> Attachments:
                            </p>
                            <ul className="space-y-3">
                            {pitch.attachments && pitch.attachments.length > 0 ? (
  <div className="mt-2">
    <ul className="space-y-3">
      {pitch.attachments.map((attachment, index) => (
        <li key={attachment} className="flex items-center space-x-2">
          <FaDownload className="text-blue-600" />
          <a
            href={attachment}
            download
            aria-label={`Download ${attachment.split("/").pop()}`} // Accessible label
            className="text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 font-medium transition-colors duration-300"
          >
            {attachment.split("/").pop()}
          </a>
        </li>
      ))}
    </ul>
    <p className="text-gray-500 dark:text-gray-400 mt-2">
      You cannot edit the attachments. To change them, delete the pitch and create a new one.
    </p>
  </div>
) : (
  <p className="text-gray-500 dark:text-gray-400">
    No attachments available.
  </p>
)}

                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                ))
              ) : (
                <div>
                  <p className="text-red-600 bold dark:text-red-500">No pitches found</p>
                  <section className="py-16 px-4 sm:px-8 lg:px-16 xl:px-24">
                    <div className="max-w-6xl mx-auto text-center">
                    <div className="relative shadow-2xl rounded-lg overflow-hidden">
  <video
    src="/pitch.mp4"
    className="w-full h-auto rounded-lg"
    controls
    preload="auto"
    autoPlay={false}
  >
    <track
      kind="subtitles" // You can use "captions" if you want it to be used for captions
      src="/path-to-your-subtitles.vtt" // Add the path to your WebVTT file for subtitles
      srcLang="en" // Change to the appropriate language code
      label="English" // Change to the appropriate label
      default // Optional: set as default if you want it to show by default
    />
    Your browser does not support the video tag.
  </video>
  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-30 pointer-events-none"></div>
</div>

                    </div>
                  </section>
                </div>
              )}
            </ul>
          </div>
        )}
        {activeTab === "add" && (
          <div className="elative min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 dark:from-gray-900 dark:to-blue-900 text-gray-900 dark:text-white">
            <h3 className="text-3xl font-bold mb-6">Create New Pitch</h3>
            <form
  onSubmit={(e) => {
    e.preventDefault();
    handleCreate();
  }}
  className="space-y-6"
>
  <div>
    <label htmlFor="title" className="relative z-10 block text-gray-700 dark:text-gray-200">Title</label>
    <input
      type="text"
      id="title"
      value={newPitch.title}
      onChange={(e) => setNewPitch({ ...newPitch, title: e.target.value })}
      placeholder="Enter title of your pitch..."
      className="border p-2 rounded w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      required
    />
  </div>
  
  <div>
    <label htmlFor="description" className="block text-gray-700 dark:text-gray-200">Description</label>
    <textarea
      id="description"
      value={newPitch.description}
      onChange={(e) => setNewPitch({ ...newPitch, description: e.target.value })}
      placeholder="Enter description for your pitch..."
      className="border p-2 rounded w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      required
    />
  </div>
  
  <div className="mb-6">
    <label htmlFor="fundingGoal" className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
      Funding Goal (in Rands)
    </label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 dark:text-gray-400">R</span>
      <input
        type="number"
        id="fundingGoal"
        name="fundingGoal"
        value={newPitch.fundingGoal}
        onChange={(e) => setNewPitch({ ...newPitch, fundingGoal: parseFloat(e.target.value) || 0 })}
        placeholder="Enter the funding goal"
        className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        min="0"
        required
      />
    </div>
  </div>
  
  <div>
    <label htmlFor="videoFile" className="block text-gray-700 dark:text-gray-200">Video file (File must be 50MB or less)</label>
    <input
      type="file"
      id="videoFile"
      onChange={(e) => {
        const file = e.target.files?.[0] || null;
        setVideoFile(file);
      }}
      className="border p-2 rounded w-full"
      accept="video/*"
    />
    {videoFile && (
      <video
        controls
        className="w-full max-w-full rounded-lg border border-gray-300 dark:border-gray-700"
        style={{ maxHeight: "500px" }}
      >
        <source src={URL.createObjectURL(videoFile)} type={videoFile.type} />
        Your browser does not support the video tag.
      </video>
    )}
  </div>

  <div>
    <label htmlFor="attachments" className="block text-gray-700 dark:text-gray-200">Attachments (Files must be 50MB or less)</label>
    <input
      type="file"
      id="attachments"
      multiple
      onChange={(e) => {
        const files = Array.from(e.target.files || []);
        const validFiles: File[] = [];
        const invalidFiles: File[] = [];
        
        files.forEach(file => {
          if (file.size <= 50 * 1024 * 1024) { // 50MB in bytes
            validFiles.push(file);
          } else {
            invalidFiles.push(file);
          }
        });
        
        if (invalidFiles.length > 0) {
          alert(`Some files are too large. Please ensure each file is 50MB or less.`);
        }
        
        setAttachmentFiles(validFiles);
      }}
      className="border p-2 rounded w-full"
      accept="*/*"
    />
    {attachmentFiles.length > 0 && (
      <div className="mt-2">
        {attachmentFiles.map((file, index) => (
          <div key={index} className="flex items-center justify-between mb-2">
            <a href={URL.createObjectURL(file)} target="_blank" rel="noopener noreferrer" className="text-blue-600">
              {file.name}
            </a>
          </div>
        ))}
      </div>
    )}
  </div>

  <div>
    <button
      type="submit"
      disabled={loading}
      className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors ${loading ? "cursor-not-allowed" : ""}`}
    >
      {loading ? <LoadingDots /> : "Create Pitch"}
    </button>
  </div>
</form>

          </div>
        )}
         </div>
      </div>
    </div>
  );
}
