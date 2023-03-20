import { Injectable } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class AiService {
  apiKey = "";
  constructor() {
    this.apiKey = "Bearer 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";
  }

  async query(data) {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/nitrosocke/Arcane-Diffusion",
      {
        headers: {
          Authorization: "Bearer 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",
        },
        body: JSON.stringify(data),
      }
    );
    console.log(response);
    const result = await response.data();
    return result;
  }
}
