// pages/api/roadmap/[id].js
import { connectToDatabase } from "../../../lib/mongodb";
import Roadmap from "../../../models/Roadmap";

export default async function handler(req, res) {
  await connectToDatabase();
  const { id } = req.query;

  if (req.method === "GET") {
    const roadmap = await Roadmap.findById(id);
    return res.status(200).json(roadmap);
  }

  if (req.method === "PUT") {
    const updated = await Roadmap.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json(updated);
  }

  res.status(405).end(); // Method Not Allowed
}
