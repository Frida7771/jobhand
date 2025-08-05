import multer from 'multer';
import DataParser from 'datauri/parser.js';
import path from 'path';
import { Request } from 'express';

interface MulterFile {
  originalname: string;
  buffer: Buffer;
}

// 配置内存存储
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 用于格式化上传的文件为 Data URI（Cloudinary 需要的格式）
const parser = new DataParser();

export const formatImage = (file: MulterFile): string => {
  const fileExtension = path.extname(file.originalname).toString();
  return parser.format(fileExtension, file.buffer).content as string;
};

export default upload;
