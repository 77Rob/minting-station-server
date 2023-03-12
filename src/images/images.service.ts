import { Injectable } from "@nestjs/common";
import { UploadImagesDTO } from "./dto/upload-images.dto";
import { UpdateImageDto } from "./dto/update-image.dto";

@Injectable()
export class ImagesService {
  findAll() {
    return `This action returns all images`;
  }

  findOne(id: number) {
    return `This action returns a #${id} image`;
  }

  update(id: number, updateImageDto: UpdateImageDto) {
    return `This action updates a #${id} image`;
  }

  remove(id: number) {
    return `This action removes a #${id} image`;
  }
}
