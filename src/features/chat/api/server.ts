import "server-only"
import { authServerAPI } from "@/lib/auth/server"
import { ApplicationError } from "@/lib/error"
import { chatStreamRequestBody, chatStreamRequestBodySchema } from "../schema"
import { AiModel, MessageAPIResponse } from "../types"

async function streamMessage(request: Request): Promise<Response> {
  let requestBody: chatStreamRequestBody

  try {
    const json = await request.json()

    requestBody = chatStreamRequestBodySchema.parse(json)
  } catch (error) {
    const cause = error instanceof Error ? error.message : String(error)
    throw new ApplicationError("bad_request", "Invalid request body.", cause)
  }

  const response = await authServerAPI.fetchWithAuth<Response>(`${process.env.EXTERNAL_API_URL}/chat/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
    parseResponse: "raw",
  })

  return response
}

async function getMessages(id: string): Promise<MessageAPIResponse> {
  const messages = await authServerAPI.fetchWithAuth<MessageAPIResponse>(
    `${process.env.EXTERNAL_API_URL}/messages?conversation_id=${id}`,
    {
      headers: { "Content-Type": "application/json" },
      parseResponse: "json",
    },
  )

  return messages
}

async function getAvailableModels(): Promise<AiModel[]> {
  const models = await authServerAPI.fetchWithAuth<AiModel[]>(
    `${process.env.EXTERNAL_API_URL}/models`,
    {
      headers: { "Content-Type": "application/json" },
      parseResponse: "json",
    },
  )
  console.log("Fetched models:", models);
  /* TODO: Adjust the DTO with backend
  added group and provider fields 
  */
  return models.map((model) => {
    return {
      ...model,
      group: model.name.includes("gpt") ? "OpenAI" : "Other",
      provider: model.name.includes("gpt") ? "openai" : "other",
    }
  });
}


export const chatServerAPI = {
  streamMessage,
  getMessages,
  getAvailableModels,
}
