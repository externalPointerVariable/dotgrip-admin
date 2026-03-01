import multer, { FileFilterCallback } from "multer";
import { Request } from "express";

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    file.mimetype === "application/vnd.ms-excel"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only Excel files are allowed!"));
  }
};

export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
});