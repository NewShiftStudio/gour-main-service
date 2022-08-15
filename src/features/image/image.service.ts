import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from '../../entity/Image';
import { Repository } from 'typeorm';

const STATIC_FOLDER_PATH = path.resolve(process.cwd(), '..', 'static');
const IMAGES_FOLDER_NAME = 'images';
const STATIC_SERVER_PATH = process.env.STATIC_SERVER_PATH;

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    readonly imageRepository: Repository<Image>,
  ) {}

  findOne(id: number): Promise<Image> {
    return this.imageRepository.findOne(id);
  }

  async uploadImage(file: Express.Multer.File): Promise<Image> {
    try {
      const split = file.originalname.split('.');
      const fileName = uuid.v4() + '.' + split[split.length - 1];
      const filePath = path.join(STATIC_FOLDER_PATH, IMAGES_FOLDER_NAME);
      const exists = await this.checkExists(filePath);
      if (!exists) {
        await fs.promises.mkdir(filePath, { recursive: true });
      }

      await fs.promises.writeFile(
        path.join(filePath, fileName),
        (file.buffer as any).data,
      );

      const fileUrl =
        STATIC_SERVER_PATH +
        (STATIC_SERVER_PATH[STATIC_SERVER_PATH.length - 1] !== '/' ? '/' : '') +
        path.join(IMAGES_FOLDER_NAME, fileName);

      return this.imageRepository.save({
        full: fileUrl,
        small: fileUrl,
      });
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Произошла ошибка при записи файла',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async checkExists(filePath: string) {
    try {
      await fs.promises.access(filePath, fs.constants.R_OK | fs.constants.W_OK);
      return true;
    } catch (e) {
      return false;
    }
  }
}
