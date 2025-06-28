// pages/public/roadmap/[id].js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function PublicRoadmap() {
  const router = useRouter();
  const { id } = router.query;
  const [roadmap, setRoadmap] = useState(null);

  useEffect(() => {
    if (id) fetchRoadmap();
  }, [id]);

  const fetchRoadmap = async () => {
    const res = await fetch(`/api/roadmap/${id}`);
    const data = await res.json();
    if (!data.isPublic) return router.push("/dashboard");
    setRoadmap(data);
  };

  if (!roadmap) return <p className="p-8">Loading...</p>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold">{roadmap.title}</h1>
      <p className="text-gray-600 mb-4">{roadmap.description}</p>

      <ul className="space-y-2">
        {roadmap.steps.map((step, index) => (
          <li
            key={index}
            className={`p-2 border rounded ${
              step.completed ? "bg-green-100 line-through" : "bg-white"
            }`}
          >
            {step.title}
          </li>
        ))}
      </ul>

      <p className="text-sm text-gray-500 mt-6">Shared Roadmap — Read-only View</p>
    </div>
  );
}
