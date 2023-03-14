import { Test, TestingModule } from "@nestjs/testing";
import { Web3storageService } from "./web3storage.service";

describe("Web3storageService", () => {
  let service: Web3storageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Web3storageService],
    }).compile();

    service = module.get<Web3storageService>(Web3storageService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
