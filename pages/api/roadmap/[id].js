// pages/api/roadmap/[id].js
import connectDB from "../../../lib/db";
import Roadmap from "../../../models/Roadmap";

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === "GET") {
    const roadmap = await Roadmap.findById(id);
    return res.status(200).json(roadmap);
  }

  if (req.method === "PUT") {
    const updated = await Roadmap.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json(updated);
  }

  if (req.method === "DELETE") {
    await Roadmap.findByIdAndDelete(id);
    return res.status(204).end();
  }

  res.status(405).json({ message: "Method not allowed" });
}
