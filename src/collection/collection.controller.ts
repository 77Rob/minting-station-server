import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Req,
} from "@nestjs/common";
import { StorageService } from "src/storage/storage.service";
import { File } from "web3.storage";
import { Web3storageService } from "./../web3storage/web3storage.service";

@Controller("collection")
export class CollectionController {
  collection = {};
  constructor(
    private readonly web3storageService: Web3storageService,
    private storageService: StorageService
  ) {}

  @Get()
  getUserCollection(@Headers() headers): any {
    const userId = headers.userid;

    if (!this.collection[userId]) {
      this.collection[userId] = {
        image: "",
      };
    }

    return this.collection[userId];
  }

  @Post("image")
  async create(@Req() req, @Headers() headers): Promise<string> {
    const files = req.files;
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
  async saveAbi(@Body() body) {
    const { deploymentAddress, abi } = body.params;

    await this.storageService.saveJSON(`/abi/${deploymentAddress}.json`, abi);
  }

  @Get("abi/:address")
  async getAbi(@Param("address") address: string): Promise<any> {
    try {
      const abi = await this.storageService.getJSON(`abi/${address}.json`);
      return abi;
    } catch (e) {
      return undefined;
    }
  }

  @Post("contractURI")
  async generateContractURI(@Body() body): Promise<string> {
    const params = body.params;
    const fileObject = this.web3storageService.convertObjectToJSONFile(
      "",
      params
    );

    const cid = await this.web3storageService.uploadFiles([fileObject], false);
    const url = this.web3storageService.cidToUrl(cid);

    return url;
  }
}
