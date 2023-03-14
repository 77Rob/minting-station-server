import { Test, TestingModule } from '@nestjs/testing';
import { Web3storageController } from './web3storage.controller';

describe('Web3storageController', () => {
  let controller: Web3storageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Web3storageController],
    }).compile();

    controller = module.get<Web3storageController>(Web3storageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
