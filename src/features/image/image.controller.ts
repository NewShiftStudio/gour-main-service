import { Controller, HttpException } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

import { ImageService } from './image.service';

@ApiTags('images')
@Controller('images')
export class ImageController {
  constructor(readonly imageService: ImageService) {}

  @MessagePattern('upload-image')
  uploadFile(@Payload() image: Express.Multer.File) {
    console.log('image: ', image);
    if (!image) {
      throw new HttpException('field image must be provided', 400);
    }
    return this.imageService.uploadImage(image);
  }
}
