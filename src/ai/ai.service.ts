import { AiConfig } from "./ai-config";
import { Injectable } from "@nestjs/common";
import axios from "axios";
import { File } from "web3.storage";

@Injectable()
export class AiService {
  apiKey = "";
  apiUrl = "";
  constructor() {
    this.apiKey = AiConfig.api_key;
    this.apiUrl = AiConfig.api_url;
  }

  async generate(prompt: string): Promise<File | undefined> {
    try {
      let headersList = {
        Accept: "*/*",
        Authorization: this.apiKey,
        "Content-Type": "application/json",
      };

      let bodyContent = JSON.stringify({ inputs: prompt });
      let response = await axios.request({
        url: this.apiUrl,
        method: "POST",
        headers: headersList,
        responseType: "arraybuffer",
        data: bodyContent,
      });

      const imageFile = new File([response.data], "image.jpeg", {
        type: "image/jpeg",
      });

      return imageFile;
    } catch (e) {
      // Request can fail because of temporararely reaching the API rate limit
      console.error(e);
      return undefined;
    }
  }
}
