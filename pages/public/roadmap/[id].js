// pages/public/roadmap/[id].js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function PublicRoadmap() {
  const { id } = useRouter().query;
  const [roadmap, setRoadmap] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/roadmap/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.isPublic) setRoadmap(data);
        });
    }
  }, [id]);

  if (!roadmap) return <div className="p-6">Not found or private roadmap.</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{roadmap.title}</h1>
      <p className="mb-4">{roadmap.description}</p>
      <ul className="space-y-2">
        {roadmap.steps.map((step, i) => (
          <li key={i} className="p-2 border rounded bg-white">
            {step.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
