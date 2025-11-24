import { Injectable, HttpException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AiService {
  async askGroq(messages: any[]) {
    try {
      const response = await axios.post(
        process.env.GROQ_API_URL!,
        {
          model: process.env.AI_MODEL ?? 'openai/gpt-oss-20b',
          max_tokens: Number(process.env.AI_MAX_TOKENS ?? 1024),
          messages,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
          timeout: Number(process.env.GROQ_TIMEOUT_MS ?? 10000),
        }
      );

      return response.data.choices[0].message.content;
    } catch (error: any) {
      throw new HttpException(
        error?.response?.data || error.message,
        error?.response?.status || 500,
      );
    }
  }
}
