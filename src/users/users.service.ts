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

  async create({ userId }: CreateUserDto) {
    console.log(userId);
    const someFile = await fs.readFile("./demo/0_face/face_2.png");
    const docRef = this.usersCollection.doc(userId);
    await docRef.set({
      id: userId,
      created: Timestamp.now(),
      random: ["1", 2, 6, someFile],
    });
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
