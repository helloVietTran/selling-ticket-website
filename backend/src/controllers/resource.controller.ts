import { Request, Response, NextFunction } from 'express';
import sharp from 'sharp';
import path from 'path';
import { Image } from '../models/Image.model';
import { AppDataSource } from '../config/data-source';
import { AppError } from '../config/exception';
import { ErrorMap } from '../config/ErrorMap';
import { BaseResponse, UploadResponse } from '../types/response.type';
import { config } from '../config/config';

class ResourceController {
  private imageRepo = AppDataSource.getRepository(Image);

  uploadImage = async (req: Request, res: Response<BaseResponse<UploadResponse>>, next: NextFunction) => {
    try {
      const urlPre = config.resource_path;
      const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
      if (!req.file) throw AppError.fromErrorCode(ErrorMap.NO_FILE_UPLOAD);
      const imageId = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileName = `${imageId}.jpg`;
      const filePath = path.join(UPLOAD_DIR, fileName);

      // Resize và lưu ảnh
      await sharp(req.file.buffer).resize(800).jpeg({ quality: 90 }).toFile(filePath);

      const resource = this.imageRepo.create({
        id: imageId,
        url: `${urlPre}/uploads/${fileName}`
      });
      await this.imageRepo.save(resource);

      return res.json({
        message: 'upload image successfully',
        data: resource
      });
    } catch (err) {
      next(err);
    }
  };
}
export default new ResourceController();
