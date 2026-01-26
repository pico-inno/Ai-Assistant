import "server-only"
import { authServerAPI } from "@/lib/auth/server"
import { AgentDetailAPIResponse, AgentListAPIResponse } from "../types"

async function getAgentsList(): Promise<AgentListAPIResponse> {
  return authServerAPI.fetchWithAuth<AgentListAPIResponse>(`${process.env.EXTERNAL_API_URL}/agents`, {
    parseResponse: "json",
  })
}

async function getAgentDetail(id: string): Promise<AgentDetailAPIResponse> {
  return authServerAPI.fetchWithAuth<AgentDetailAPIResponse>(`${process.env.EXTERNAL_API_URL}/agents/${id}`, {
    parseResponse: "json",
  })
}

export const agentsServerAPI = {
  getAgentsList,
  getAgentDetail,
}
