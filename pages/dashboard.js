// pages/dashboard.js
import { useState, useEffect } from "react";
import { auth } from "../lib/firebase";
import { useRouter } from "next/router";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [roadmaps, setRoadmaps] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", steps: "" });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (u) {
        setUser(u);
        fetchRoadmaps(u.uid);
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchRoadmaps = async (uid) => {
    const res = await fetch("/api/roadmap");
    const data = await res.json();
    const myRoadmaps = data.filter((r) => r.userId === uid);
    setRoadmaps(myRoadmaps);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const steps = form.steps
      .split("\n")
      .map((s) => ({ title: s.trim(), description: "", completed: false }));
    const body = {
      ...form,
      userId: user.uid,
      steps,
      isPublic: false,
    };
    const res = await fetch("/api/roadmap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setRoadmaps((prev) => [...prev, data]);
    setForm({ title: "", description: "", steps: "" });
  };

  const handleLogout = async () => {
    await auth.signOut();
    router.push("/login");
  };

  const togglePublic = async (e, roadmap) => {
    e.preventDefault();
    const res = await fetch(`/api/roadmap/${roadmap._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...roadmap, isPublic: !roadmap.isPublic }),
    });
    const updated = await res.json();
    setRoadmaps((prev) =>
      prev.map((r) => (r._id === roadmap._id ? updated : r))
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Roadmaps</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <form
        onSubmit={handleCreate}
        className="bg-white p-6 rounded-lg shadow-md mb-6 max-w-xl"
      >
        <h2 className="text-xl font-semibold mb-4">Create a New Roadmap</h2>
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 border rounded mb-4"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          placeholder="Description"
          className="w-full p-2 border rounded mb-4"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <textarea
          placeholder="Steps (one per line)"
          className="w-full p-2 border rounded mb-4"
          value={form.steps}
          onChange={(e) => setForm({ ...form, steps: e.target.value })}
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Create
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roadmaps.map((roadmap, index) => (
          <Link href={`/roadmap/${roadmap._id}`} key={roadmap._id}>
            <motion.div
              whileHover={{ scale: 1.03 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white p-4 rounded shadow hover:shadow-lg cursor-pointer"
            >
              <h3 className="text-xl font-semibold">{roadmap.title}</h3>
              <p className="text-sm text-gray-600">{roadmap.description}</p>
              <ul className="mt-2 text-sm list-disc list-inside">
                {roadmap.steps.slice(0, 3).map((s, i) => (
                  <li key={i}>{s.title}</li>
                ))}
              </ul>

              <div className="mt-4 space-y-1">
                <button
                  onClick={(e) => togglePublic(e, roadmap)}
                  className="text-xs text-blue-600 underline"
                >
                  {roadmap.isPublic ? "Make Private" : "Make Public"}
                </button>

                {roadmap.isPublic && (
                  <a
                    href={`/public/roadmap/${roadmap._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-green-600 underline block"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Public Link
                  </a>
                )}
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
