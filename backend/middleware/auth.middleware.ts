import express from "express";

function authorize(req: express.Request,
  res: express.Response,
  next: express.NextFunction) {
  if (req.role == "admin") next();
  res.status(403).json({ message: "Access denied" });
}

export default authorize;