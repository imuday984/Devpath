// pages/roadmap/[id].js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { auth } from "../../lib/firebase";

export default function RoadmapDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [roadmap, setRoadmap] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) return router.push("/login");
      setUserId(user.uid);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (id) fetchRoadmap();
  }, [id]);

  const fetchRoadmap = async () => {
    const res = await fetch(`/api/roadmap/${id}`);
    const data = await res.json();
    setRoadmap(data);
  };

  const toggleStep = async (stepIndex) => {
    const updatedSteps = [...roadmap.steps];
    updatedSteps[stepIndex].completed = !updatedSteps[stepIndex].completed;

    const res = await fetch(`/api/roadmap/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...roadmap, steps: updatedSteps }),
    });

    const updated = await res.json();
    setRoadmap(updated);
  };

  const handleUpdate = async () => {
    const res = await fetch(`/api/roadmap/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(roadmap),
    });
    const updated = await res.json();
    setRoadmap(updated);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this roadmap?")) return;
    await fetch(`/api/roadmap/${id}`, { method: "DELETE" });
    router.push("/dashboard");
  };

  if (!roadmap) return <p className="p-8">Loading...</p>;

  const isOwner = roadmap.userId === userId;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {isEditing ? (
        <>
          <input
            className="w-full p-2 border rounded mb-4"
            value={roadmap.title}
            onChange={(e) => setRoadmap({ ...roadmap, title: e.target.value })}
          />
          <textarea
            className="w-full p-2 border rounded mb-4"
            value={roadmap.description}
            onChange={(e) =>
              setRoadmap({ ...roadmap, description: e.target.value })
            }
          />
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold">{roadmap.title}</h1>
          <p className="text-gray-600 mb-4">{roadmap.description}</p>
        </>
      )}

      <ul className="space-y-2">
        {roadmap.steps.map((step, index) => (
          <li
            key={index}
            className={`p-2 border rounded flex justify-between items-center ${
              step.completed ? "bg-green-100 line-through" : "bg-white"
            }`}
          >
            <span>{step.title}</span>
            {isOwner && (
              <button
                className="text-sm text-blue-600"
                onClick={() => toggleStep(index)}
              >
                {step.completed ? "Undo" : "Mark Done"}
              </button>
            )}
          </li>
        ))}
      </ul>

      {isOwner && (
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-yellow-400 text-white px-4 py-2 rounded"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
          {isEditing && (
            <button
              onClick={handleUpdate}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save Changes
            </button>
          )}
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
