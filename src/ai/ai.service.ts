import { Injectable } from "@nestjs/common";
import axios from "axios";
import { File } from "web3.storage";

@Injectable()
export class AiService {
  apiKey = "";
  constructor() {
    this.apiKey = "Bearer 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";
  }

  async generate(prompt: string): Promise<File | undefined> {
    try {
      let headersList = {
        Accept: "*/*",
        Authorization: "Bearer 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",
        "Content-Type": "application/json",
      };

      let bodyContent = JSON.stringify({ inputs: prompt });

      let response = await axios.request({
        url: "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
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
