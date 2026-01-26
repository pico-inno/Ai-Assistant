"use client"

import Link from "next/link"
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@mijn-ui/react"
import { AgentIcon, AgentIconName } from "./components/agent-icon"
import { useAgentList } from "./api/queries"
import { Agent } from "./types"

const AgentsList = () => {
    const { data, isLoading, isError, refetch } = useAgentList()
    const agents = data?.data ?? []
    console.log("AgentsList agents:", agents)
    if (isLoading) {
        return (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                    <AgentCardSkeleton key={index} />
                ))}
            </div>
        )
    }

    if (isError) {
        return (
            <div className="flex items-center justify-between rounded-md border border-dashed border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger-emphasis">
                <div>
                    <p className="font-semibold">Failed to load agents</p>
                    <p className="text-xs text-danger-emphasis/80">Please check your connection and try again.</p>
                </div>
                <Button size="sm" onClick={() => refetch()}>
                    Retry
                </Button>
            </div>
        )
    }

    if (agents.length === 0) {
        return (
            <div className="rounded-md border border-dashed px-4 py-6 text-sm text-secondary-foreground">
                No agents found. Create one to get started.
            </div>
        )
    }

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-center gap-3">
                <div>
                    <h2 className="text-lg font-semibold leading-tight text-foreground">Agents</h2>
                    <p className="text-sm text-secondary-foreground">Pick an agent to start chatting.</p>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {agents.map((agent) => (
                    <Link href={`/chat?agent=${agent.id}`} key={agent.id}>
                        <AgentCard agent={agent} />
                    </Link>
                ))}
            </div>
        </section>
    )
}

const AgentCard = ({ agent }: { agent: Agent }) => {
    const iconName = (agent.icon as AgentIconName | null) ?? "Bot"
    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-start gap-3">
                <span className="flex size-12 items-center justify-center rounded-md bg-muted">
                    <AgentIcon icon={iconName} />
                </span>
                <div className="space-y-1">
                    <CardTitle className="text-base leading-tight">{agent.name}</CardTitle>
                    <CardDescription className="line-clamp-2 text-sm">{agent.description}</CardDescription>
                </div>
            </CardHeader>

            <CardFooter className="flex justify-end">
                
            </CardFooter>
        </Card>
    )
}

const AgentCardSkeleton = () => {
    return (
        <Card className="h-full animate-pulse">
            <CardHeader className="flex flex-row items-start gap-3">
                <span className="flex size-12 rounded-md bg-muted" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 w-24 rounded bg-muted" />
                    <div className="h-3 w-32 rounded bg-muted" />
                </div>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="h-3 w-full rounded bg-muted" />
                <div className="h-3 w-3/5 rounded bg-muted" />
            </CardContent>
            <CardFooter>
                <div className="h-9 w-20 rounded-md bg-muted" />
            </CardFooter>
        </Card>
    )
}

export { AgentsList }