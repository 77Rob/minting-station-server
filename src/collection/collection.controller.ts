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
  collectionSettings = {};
  contractPath = "contracts.json";

  constructor(
    private readonly web3storageService: Web3storageService,
    private storageService: StorageService
  ) {}

  @Get()
  getUserCollection(@Headers() headers): any {
    const userId = headers.userid;

    if (!this.collectionSettings[userId]) {
      this.collectionSettings[userId] = {
        image:
          "https://w3s.link/ipfs/bafybeib52qabkd5d3kcxtd3xfetjyquiytbd32wgaiw2dngsuhacdgc7nu/favicon.jpg",
      };
    }

    return this.collectionSettings[userId];
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

    if (!this.collectionSettings[userId]) {
      this.collectionSettings[userId] = {
        image: ipfsURL,
      };
    } else {
      this.collectionSettings[userId].image = ipfsURL;
    }
    return ipfsURL;
  }

  @Post("image/delete")
  async deleteImage(@Req() req, @Headers() headers) {
    const userId = headers.userid;
    if (!this.collectionSettings[userId]) {
      this.collectionSettings[userId] = {
        image: "",
      };
    }

    this.collectionSettings[userId].image = "";
    return;
  }

  @Post("save")
  async saveContractDeployment(@Body() body) {
    const { collection } = body.params;
    let collections = [];
    try {
      collections = await this.storageService.getJSON(this.contractPath);
    } catch (error) {
      await this.storageService.saveJSON(this.contractPath, [collection]);
      return;
    }

    if (collections.find((c) => c.address === c.address).length > 0) {
      const collectionsTemp = collections.filter(
        (c) => c.address !== c.address
      );
      const updatedCollections = [...collectionsTemp, collection];
      await this.storageService.saveJSON(this.contractPath, updatedCollections);
      return;
    }

    const updatedCollections = [...collections, collection];

    await this.storageService.saveJSON(this.contractPath, updatedCollections);
    return;
  }

  @Get(":address")
  async getAbi(@Param("address") address: string): Promise<any> {
    const contracts = await this.storageService.getJSON(this.contractPath);
    const contract = contracts.find((c) => c.address === address);

    if (!contract) {
      return null;
    }

    return contract;
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
