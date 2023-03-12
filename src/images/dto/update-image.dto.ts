import { PartialType } from "@nestjs/mapped-types";
import { UploadImagesDTO } from "./upload-images.dto";

export class UpdateImageDto extends PartialType(UploadImagesDTO) {}
