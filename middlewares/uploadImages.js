import multer from "multer";
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/Images"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".jpeg");
  },
});

const dir = async (req, res) => {
  console.log(path.join(__dirname, "../public/Images"));
};

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(
      {
        message: "Unsupported file format",
      },
      false
    );
  }
};

const uploadPhoto = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fieldSize: 2000000 },
});

const parkingImgResize = async (req, res, next) => {
  console.log("heyer" + __dirname);
  if (!req.files) return next();

  await Promise.all(
    req.files.map(async (file) => {
      const destinationPath = `public/Images/parking/${file.filename}`;

      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(destinationPath);
      fs.unlinkSync(destinationPath);
    })
  );
  next();
};

export { uploadPhoto, parkingImgResize, dir };
