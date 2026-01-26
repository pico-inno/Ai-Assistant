export type AgentIconType =
  | "User"
  | "Puzzle"
  | "Bot"
  | "Zap"
  | "Database"
  | "Code"
  | "Sparkles"
  | "Brain"
  | "ShoppingCart"
  | "MessageSquare"
  | "Headphones"

export type AgentSetting = {
  id: string | number
  agent_id: string
  temperature: number
  max_tokens: number
  memory_enabled: boolean
  [key: string]: unknown
}

export type Agent = {
  id: string
  name: string
  description: string
  model: string
  instructions: string
  agent_setting?: AgentSetting | null
  icon?: AgentIconType | null
  created_at?: string
  updated_at?: string
}

export type AgentListAPIResponse = {
  data: Agent[]
}

export type AgentDetail = Agent

export type AgentDetailAPIResponse = {
  data: AgentDetail
}
