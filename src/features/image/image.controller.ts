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
    return this.imageService.uploadImage(image);
  }
}
