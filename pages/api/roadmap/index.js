// pages/api/roadmap/index.js
import connectDB from "../../../lib/db";
import Roadmap from "../../../models/Roadmap";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    const roadmaps = await Roadmap.find();
    return res.status(200).json(roadmaps);
  }

  if (req.method === "POST") {
    const { userId, title, description, steps, isPublic } = req.body;
    const newRoadmap = new Roadmap({ userId, title, description, steps, isPublic });
    await newRoadmap.save();
    return res.status(201).json(newRoadmap);
  }

  res.status(405).json({ message: "Method not allowed" });
}
