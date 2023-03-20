import { IImage } from "src/images/entities/image.entity";
import { AiService } from "./../ai/ai.service";
import { Web3storageService } from "./../web3storage/web3storage.service";
import {
  Controller,
  Headers,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
  Req,
  Body,
} from "@nestjs/common";
import { File } from "web3.storage";
import { CollectionService } from "./collection.service";
import { StorageService } from "src/storage/storage.service";
import { FilesInterceptor } from "@nestjs/platform-express";

@Controller("collection")
export class CollectionController {
  collection = {};
  constructor(
    private readonly web3storageService: Web3storageService,
    private storageService: StorageService,
    private aiService: AiService
  ) {}

  @Get()
  getUserCollection(@Headers() headers) {
    const userId = headers.userid;

    console.log(this.collection[userId]);
    console.log(userId);
    console.log(this.collection);
    if (!this.collection[userId]) {
      this.collection[userId] = {
        image: "",
      };
    }

    return this.collection[userId];
  }

  @Post("image")
  @UseInterceptors(FilesInterceptor("image"))
  async create(@UploadedFiles() files, @Headers() headers) {
    const userId = headers.userid;

    const fileFormatted = new File([files[0].buffer], files[0].originalname);
    const ipfsCID = await this.web3storageService.uploadFiles([fileFormatted]);
    const ipfsURL = `${this.web3storageService.cidToUrl(ipfsCID)}/${
      files[0].originalname
    }`;

    if (!this.collection[userId]) {
      this.collection[userId] = {
        image: ipfsURL,
      };
    } else {
      this.collection[userId].image = ipfsURL;
    }
    return ipfsURL;
  }

  @Post("abi")
  async saveAbi(@Headers() headers, @Body() body) {
    const { deploymentAddress } = body.params;

    await this.storageService.saveJSON(
      `/abi/${deploymentAddress}.json`,

      body.params
    );
  }

  @Get("abi/:address")
  async getAbi(@Param("address") address: string) {
    try {
      const abi = await this.storageService.getJSON(`abi/${address}.json`);
      return abi;
    } catch (e) {
      console.log(e);
      return undefined;
    }
  }

  @Post("contractURI")
  async generateContractURI(
    @Headers("userId") userId: any,
    @Req() req,
    @Body() body
  ) {
    const params = body.params;

    // console.log(req);
    const fileObject = this.web3storageService.makeFileObject("", params);
    const cid = await this.web3storageService.uploadFiles([fileObject], false);
    const url = this.web3storageService.cidToUrl(cid);

    return url;
  }
}
