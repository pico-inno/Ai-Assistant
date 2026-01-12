"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
 } from "@mijn-ui/react"
import { Plus, EllipsisVertical, Edit, Trash2} from "lucide-react"
import { LayoutMobileDrawerClose } from "@/components/layout/layout"
import {
  WorkspaceLayoutPanelContainer,
  WorkspaceLayoutPanelContent,
  WorkspaceLayoutPanelHeader,
  WorkspaceLayoutPanelTitle,
} from "@/components/layout/workspace/workspace"
import { useAgentList } from "./api/queries"
import { AgentIcon, AgentIconName } from "./components/agent-icon"
import { Agent } from "./types"
import { title } from "process"
import { useConfirmationStore } from "@/components/confirmation-dialog"

const AgentsList = () => {
  const { data: agents, isLoading, isError } = useAgentList()

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-14 w-full animate-pulse rounded-md bg-muted" />
          ))}
        </div>
      )
    }

    if (isError) {
      return (
        <div className="px-4 text-sm text-danger-emphasis">Something went wrong! Please try refreshing the page.</div>
      )
    }

    if (!agents || agents.data?.length === 0) {
      return <div className="p-2 text-sm text-secondary-foreground/70">{"No agents yet."}</div>
    }

    return (
      <ul>
        {agents.data.map((agent) => (
          <li key={agent.id} className="text-sm">
            <AgentsListItem agent={agent} />
          </li>
        ))}
      </ul>
    )
  }

  return (
    <WorkspaceLayoutPanelContainer>
      <WorkspaceLayoutPanelHeader>
        <WorkspaceLayoutPanelTitle>AI Agents</WorkspaceLayoutPanelTitle>
      </WorkspaceLayoutPanelHeader>
      <div className="my-2 px-4 md:mt-0">
        <LayoutMobileDrawerClose asChild>
          <Button variant="default" asChild className="w-full justify-between text-secondary-foreground">
            <Link href="/agents" className="truncate">
              <span className="truncate">Create New Agent</span>
              <Plus className="size-4 shrink-0" />
            </Link>
          </Button>
        </LayoutMobileDrawerClose>
      </div>

      <WorkspaceLayoutPanelContent className="px-4">{renderContent()}</WorkspaceLayoutPanelContent>
    </WorkspaceLayoutPanelContainer>
  )
}

export { AgentsList }

const AgentsListItem = ({ agent }: { agent: Agent }) => {
  const pathname = usePathname()
  const router = useRouter()
  const { closeConfirmation, openConfirmation } = useConfirmationStore()
  const href = `/chat?agent=${agent.id}`

  const onOpenEdit = (id: string) => {
    router.push(`/agents/${id}`);
  }

  const onOpenDelete = (id: string, name: string) => {
    openConfirmation({
      title: "Delete Agent",
      description: `Are you sure you want to delete this ${name}? This action cannot be undone.`,
      cancelLabel: "Cancel",
      actionLabel: "Delete",
      actionState: "danger",
      onAction: () => {
        // Call delete API here
        console.log(`Agent with id ${id} deleted.`);
        closeConfirmation();
      },
      onCancel: () => {
        closeConfirmation();
      },
    });
  }

  return (
    <div className="group relative mb-2" data-state={'active'}>
      <LayoutMobileDrawerClose asChild>
        <Button
          asChild
          variant="ghost"
          data-state={pathname === `/agents/${agent.id}` ? "active" : "inactive"}
          className="h-14 w-full justify-start gap-2 truncate pr-12 py-2 text-sm text-secondary-foreground hover:bg-muted hover:text-foreground data-[state=active]:bg-muted">
          <Link href={href} className="flex h-full w-full items-center gap-2 truncate">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted transition duration-300 group-hover:bg-secondary group-data-[state=active]:bg-secondary">
              <AgentIcon icon={agent.icon as AgentIconName} />
            </span>
            <div className="w-full truncate">
              <p className="truncate text-sm font-medium">{agent.name}</p>
              <p className="truncate text-xs text-secondary-foreground">{agent.description}</p>
            </div>
          </Link>
        </Button>
      </LayoutMobileDrawerClose>

      <DropdownMenu>
        <DropdownMenuTrigger asChild unstyled>
          <Button
            iconOnly
            size="md"
            variant="ghost"
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-muted opacity-0 !ring-transparent !ring-offset-transparent hover:bg-background group-hover:opacity-100 data-[state=open]:opacity-100"
            aria-label="More options">
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={0} className="transition-none">
          <DropdownMenuGroup className="flex flex-col">
            <DropdownMenuItem asChild
              onSelect={(e) => {
                onOpenEdit(agent.id)
              }}>
              <Button variant="ghost" size="sm" className="justify-start rounded-none text-secondary-foreground outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 hover:outline-none hover:ring-0 cursor-pointer">
                <Edit className=" mr-1.5 size-4"/>
                Edit
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem 
              asChild
              onSelect={(e) => {
                onOpenDelete(agent.id, agent.name)
              }}>
              <Button variant="ghost" size="sm" className="justify-start rounded-none text-secondary-foreground outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 hover:outline-none hover:ring-0 cursor-pointer">
                <Trash2 className=" mr-1.5 size-4"/>
                Delete
              </Button>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
