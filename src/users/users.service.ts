import {
  Injectable,
  Inject,
  Logger,
  InternalServerErrorException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersDocument } from "./entities/user.document";
import { CollectionReference, Timestamp } from "@google-cloud/firestore";
import * as fs from "fs/promises";

@Injectable()
export class UsersService {
  private logger: Logger = new Logger(UsersService.name);

  constructor(
    @Inject(UsersDocument.collectionName)
    private usersCollection: CollectionReference<UsersDocument>
  ) {}

  async updateImage({ userId, newImage }) {
    const docRef = this.usersCollection.doc(userId);
    await docRef.set({
      image: newImage,
    });
    return (await docRef.get()).data();
  }

  async get({ userId }) {
    const docRef = this.usersCollection.doc(userId);
    return (await docRef.get()).data();
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
