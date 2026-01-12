'use server'

export async function getAvailableModels() {
  const { chatServerAPI } = await import("../api/server")
  return chatServerAPI.getAvailableModels()
}
