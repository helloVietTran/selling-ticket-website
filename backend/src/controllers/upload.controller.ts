import { Request, Response, NextFunction } from 'express';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { Upload } from '../models/Upload.model';
import { AppDataSource } from '../config/data-source';
import { AppError } from '../config/exception';
import { ErrorMap } from '../config/ErrorMap';
import { BaseResponse } from '../types/response.type';
import { config } from '../config/config';

class UploadController {
  private uploadRepo = AppDataSource.getRepository(Upload);
  uploadImage = async (req: Request, res: Response<BaseResponse<any>>, next: NextFunction) => {
    try {
      const urlPre = config.url_upload;
      const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR);
      }
      if (!req.file) throw AppError.fromErrorCode(ErrorMap.NO_FILE_UPLOAD);
      const imageId = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileName = `${imageId}.jpg`;
      const filePath = path.join(UPLOAD_DIR, fileName);

      // Resize và lưu ảnh
      await sharp(req.file.buffer)
        .resize(800) 
        .jpeg({ quality: 90 })
        .toFile(filePath);
      const resource = this.uploadRepo.create({
        id: imageId,
        url: `${urlPre}/uploads/${fileName}`
      });
      await this.uploadRepo.save(resource);

      const uploads = await this.uploadRepo.find({ take: 1 });
      const upload = uploads[0] ?? null;
      if (!upload) {
        return 0;
      }
      const parsed = new URL(upload.url);
      if (urlPre !== parsed.origin) {
        await AppDataSource.createQueryBuilder()
          .update(Upload)
          .set({
            url: () => `REPLACE(url, :oldDomain, :newDomain)`
          })
          .where('url LIKE :oldDomainLike', { oldDomainLike: `${parsed.origin}/%` })
          .setParameters({
            oldDomain: parsed.origin,
            newDomain: urlPre
          })
          .execute();
      }
      return res.json({
        message: 'upload image successfully',
        url: `${urlPre}/uploads/${fileName}`
      });
    } catch (err) {
      next(err);
    }
  };
}
export default new UploadController();
