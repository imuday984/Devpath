// pages/api/roadmap/index.js
import { connectToDatabase } from "../../../lib/mongodb";
import Roadmap from "../../../models/Roadmap";

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === "GET") {
    const roadmaps = await Roadmap.find();
    return res.status(200).json(roadmaps);
  }

  if (req.method === "POST") {
    const newRoadmap = await Roadmap.create(req.body);
    return res.status(201).json(newRoadmap);
  }

  res.status(405).end(); // Method Not Allowed
}
