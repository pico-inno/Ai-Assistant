import { AgentDetailPlaceholder } from "@/features/agents/components/agent-detail"
import { authServerAPI } from "@/lib/auth/server"
import { WorkspaceLayoutMainContainer } from "@/components/layout/workspace/workspace"
import { RefreshAccessToken } from "@/components/refresh-access-token"
import { AgentsList } from "@/features/agents/agents-list"

const Page = async () => {
  const session = await authServerAPI.validateTokenCached()

  if (!session) {
    return <RefreshAccessToken />
  }

  return (
    <WorkspaceLayoutMainContainer>
      <div className="flex size-full items-center justify-center p-4">
        <div className="-mt-24">
          <AgentsList />
        </div>
      </div>
    </WorkspaceLayoutMainContainer>
  )
}

export default Page
