# Backend service for Minting Station

This is a documentation for the backend service for Minting Station. The backend service is a NestJS application that provides a REST API for the Minting Station frontend. The backend service contains the following services:

- Storage Service
- Web3 Storage Service
- Collection Service
- Images Service
- Ai Service

## Web3storageService

### The Web3storageService is a NestJS service that provides methods to interact with the Web3.Storage API, a decentralized storage network built on top of the InterPlanetary File System (IPFS). This service provides the following methods:

- `convertObjectToJSONFile(fileName: string, object: any): File`
  This method converts a JavaScript object to a JSON file that can be uploaded to the Web3.Storage network. The method takes two arguments:

  - `fileName`: The name of the file to be created
  - `object`: The JavaScript object to be converted to a JSON file
    The method returns a File object that can be uploaded to the Web3.Storage network.

- `async uploadJSONFile(fileName: string, object: any): Promise<string>`
  This method uploads a JSON file to the Web3.Storage network. The method takes two arguments:

  - `fileName`: The name of the file to be uploaded
  - `object`: The JavaScript object to be converted to a JSON file and uploaded
    The method returns a Promise that resolves with the CID (Content Identifier) of the uploaded file.

- `cidToUrl(cid: string): string` This method takes a CID and returns the URL that can be used to access the file on the Web3
  Storage network. The method takes one argument:

  - `cid`: The CID of the file to be accessed.
    The method returns a string containing the URL of the file.

- `async getFiles(path: string): Promise<any[]>`
  This method retrieves an array of files from the local filesystem at the specified path. The method takes one argument:

  - `path`: The path of the directory containing the files to be retrieved.
    The method returns a Promise that resolves with an array of files.

- `async uploadFiles(files: File[], wrapWithDirectory: boolean = true): Promise<string>`
  This method uploads an array of files to the Web3.Storage network. The method takes two arguments:
  - `files`: An array of File objects to be uploaded.
  - `wrapWithDirectory (optional)`: A boolean flag indicating whether the files should be wrapped in a directory. Default value is true.
    The method returns a Promise that resolves with the CID (Content Identifier) of the uploaded files.

### Constructor

The Web3storageService constructor creates a new instance of the Web3Storage class and sets the token property to the Web3.Storage API key specified in the Web3StorageConfig module. It also sets the ipfsResolver property to the IPFS resolver specified in the Web3StorageConfig module.

## StorageService

The `StorageService` class is an injectable service that allows you to interact with the Google Cloud Storage API. It provides methods to upload, download, and delete files from a specified bucket.

## Constructor

The StorageService constructor initializes the Storage client from the @google-cloud/storage package using the credentials defined in StorageConfig. It also sets the bucket property of the class to the mediaBucket defined in StorageConfig.

Methods
saveJSON
`saveJSON(path: string, jsonObject: any): Promise<string>`
This method takes in a path string representing the path to the JSON file and a jsonObject of type any representing the JSON object to be saved. It saves the JSON object to the specified path in the bucket and returns a signed URL that can be used to access the file. If there is an error saving the file, it will throw an error.

saveImage
`saveImage(path: string, imageFile: Blob): Promise<void>`

This method takes in a path string representing the path to the image file and an imageFile of type Blob representing the image file to be saved. It saves the image file to the specified path in the bucket. If there is an error saving the file, it will throw an error.

getJSON
`getJSON(path: string): Promise<any>`

This method takes in a path string representing the path to the JSON file and returns the JSON object at that path in the bucket. If there is an error retrieving the file, it will throw an error.

getAllFilesFromImagePath
`getAllFilesFromImagePath(userId: string): Promise<[File, any][]>`

This method takes in a userId string representing the user ID and returns an array of tuples representing the image files and their corresponding JSON metadata. It retrieves all the files in the /userId/image/images/ directory and maps each file to a tuple containing the image file and the corresponding JSON metadata file. If there is an error retrieving the files, it will throw an error.

getAllParsedJSONFilesFromPath
`getAllParsedJSONFilesFromPath(path: string): Promise<any[]>`

This method takes in a path string representing the path to the directory containing JSON files and returns an array of parsed JSON objects. It retrieves all the files in the specified directory and maps each file to its parsed JSON object. If there is an error retrieving the files, it will throw an error.

saveMedia
`saveMedia(path: string, contentType: string, media: Buffer, metadata: { [key: string]: string | any }[]): Promise<string>`

This method takes in a path string representing the path to the media file, a contentType string representing the content type of the media file, a media of type Buffer representing the media file to be saved, and a metadata object of type { [key: string]: string | any }[] representing the metadata to be attached to the media file. It saves the media file to the specified path in the bucket and attaches the provided metadata to the file. It returns a signed URL that can be used to access the file. If there is an error saving the file, it will throw an error.

delete
`delete(path: string): Promise<void>`

This method takes in a path string representing the path to the file to be deleted and deletes the file from the bucket. If the file does not exist, it will ignore the error and continue. If there is an error deleting the file, it will throw an error.

## CollectionController API Documentation

The CollectionController is responsible for handling requests related to user collections and contract deployment.

**Controller Overview**
**Controller base route: /collection**

constructor(
private readonly web3storageService: Web3storageService,
private storageService: StorageService
)

web3storageService: An instance of the Web3storageService used to upload files to the IPFS network.
storageService: An instance of the StorageService used to save and retrieve JSON data from the local file system.

**@Get()**
`getUserCollection(@Headers() headers): any`

Description: Retrieves the user's collection settings based on the userid value included in the request headers.
Request headers:userid: The user ID to retrieve collection settings for.

Returns: The collection settings for the specified user as an object.

**@Post("image")**
`async create(@Req() req, @Headers() headers): Promise<string>`
Description: Uploads an image file to the IPFS network and sets the user's collection image to the resulting IPFS URL.

Request headers:
userid: The user ID to set the collection image for.

Request body: The image file to upload.

Returns: The IPFS URL for the uploaded image.

**@Post("image/delete")**
`async deleteImage(@Req() req, @Headers() headers)`
Description: Deletes the user's collection image by setting the image property of the collection settings object to an empty string.

Request headers:
userid: The user ID to delete the collection image for.

Returns: An empty response.

**@Post("save")**
`async saveContractDeployment(@Body() body)`

Description: Saves the deployment information for a new contract to a local JSON file.

Request body: An object containing the contract deployment information to be saved.

Returns: An empty response.

**@Get(":address")**
`async getAbi(@Param("address") address: string): Promise<any>`

Description: Retrieves the contract deployment information for the contract at the specified address from the local JSON file.

Request parameters:
address: The address of the contract to retrieve information for.

Returns: The contract deployment information for the specified contract as an object.

**@Post("contractURI")**
`async generateContractURI(@Body() body): Promise<string>`

Description: Generates a contract URI for a newly deployed contract and uploads it to the IPFS network.

Request body: An object containing the contract deployment information used to generate the contract URI.

Returns: The IPFS URL for the uploaded contract URI.

# NestJS Images Controller

This is a controller for managing images and AI generated images for a NestJS application. It provides endpoints for uploading, getting, updating, and deleting images and AI generated images. It also provides endpoints for generating metadata URIs for images and AI generated images.

ImagesController
@Post() upload(@Headers() headers, @Req() req)
Uploads images to the server and saves them to a storage service.

Request Parameters:

headers: An object containing HTTP request headers.
req: The HTTP request object.
Request Body:

files: An array of files to be uploaded.
userId: The ID of the user who is uploading the images. This is retrieved from the headers object.
Response:

Returns a JSON string containing information about the uploaded images.
@Post("generateai") getAi(@Body() body)
Generates an AI-generated image based on the prompt provided in the request body. The generated image is then uploaded to IPFS and saved to a storage service.

Request Body:

params: An object containing the prompt used to generate the image.
headers: An object containing HTTP request headers.
Response:

Returns an object containing information about the generated image.
@Get() getUserImageData(@Headers("userId") userId: any)
Retrieves all of the images uploaded by a specific user.

Request Headers:

userId: The ID of the user whose images should be retrieved.
Response:

Returns an array of objects containing information about each image.
@Get("ai") getUserAiGeneratedImageData(@Headers("userId") userId: any)
Retrieves all of the AI-generated images uploaded by a specific user.

Request Headers:

userId: The ID of the user whose AI-generated images should be retrieved.
Response:

Returns an array of objects containing information about each AI-generated image.
@Post("delete") deleteUserImages(@Body() body)
Deletes specific images uploaded by a user.

Request Body:

params: An object containing an array of image file names to be deleted.
headers: An object containing HTTP request headers.
Response:

Returns void.
@Post("update") updateImageData(@Body() body)
Updates the metadata for a specific image uploaded by a user.

Request Body:

params: An object containing the updated metadata for the image.
headers: An object containing HTTP request headers.
Response:

Returns void.
@Post("ai/update") updateAiGeneratedImageData(@Body() body)
Updates the metadata for a specific AI-generated image uploaded by a user.

Request Body:

params: An object containing the updated metadata for the AI-generated image.
headers: An object containing HTTP request headers.
Response:

Returns void.
@Get("metadataURI") generateMetadataURI(@Headers("userId") userId: any)
Generates a metadata URI for a user's uploaded images and uploads the metadata to IPFS.

Request Headers:

userId: The ID of the user whose image metadata should be generated.
Response:

Returns the URI of the uploaded metadata file.
@Get("ai/metadataURI") generateMetadataURIAi(@Headers("userId") userId: any)
Generates a metadata URI for a user's AI-generated images and uploads the metadata to IPFS.

Request Headers:

userId: The ID of the user whose AI-generated image metadata should be generated.
Response:

Returns the URI of the uploaded metadata file.

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
