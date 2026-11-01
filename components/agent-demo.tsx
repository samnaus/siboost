"use client"

import { FormEvent, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { SiteContent } from "@/lib/content/types"

type Message = { role: "assistant" | "user"; text: string }

export function AgentDemo({ agent }: { agent: SiteContent["agent"] }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Kia ora. I can walk through a few prepared questions for a fictional home builder. This is a demonstration, so I only have that short script.",
    },
  ])
  const [draft, setDraft] = useState("")

  function replyTo(userText: string) {
    const match = agent.script.find((turn) => userText.trim().toLowerCase() === turn.user.trim().toLowerCase())
    const assistant = match?.assistant ?? agent.fallbackReply
    setMessages((current) => [...current, { role: "user", text: userText }, { role: "assistant", text: assistant }])
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    const value = draft.trim()
    if (!value) return
    setDraft("")
    replyTo(value)
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_50px_-36px_rgba(15,23,42,0.6)]">
      <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
        <strong>Demonstration.</strong> {agent.demoDisclaimer}
      </div>
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
        <div>
          <p className="font-semibold text-[#0f172a]">Example assistant</p>
          <p className="text-xs text-slate-500">{agent.demoBusiness}</p>
        </div>
        <Badge variant="outline">Demo</Badge>
      </div>
      <div className="h-80 space-y-3 overflow-y-auto bg-slate-50 p-4" role="log" aria-live="polite" aria-relevant="additions">
        {messages.map((message, index) => (
          <p
            key={`${message.role}-${index}`}
            className={
              message.role === "user"
                ? "ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-[#2563eb] px-3 py-2 text-sm leading-6 text-white"
                : "max-w-[90%] rounded-2xl rounded-bl-md bg-white px-3 py-2 text-sm leading-6 text-slate-800 shadow-sm"
            }
          >
            <span className="sr-only">{message.role === "user" ? "You said: " : "Assistant said: "}</span>
            {message.text}
          </p>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 border-t border-slate-200 px-4 py-3">
        {agent.script.map((turn) => (
          <button
            key={turn.prompt}
            type="button"
            className="rounded-full border border-slate-200 px-3 py-1.5 text-left text-sm font-medium text-slate-700 hover:border-[#2563eb] hover:text-[#1d4ed8]"
            onClick={() => replyTo(turn.user)}
          >
            {turn.prompt}
          </button>
        ))}
      </div>
      <form onSubmit={onSubmit} className="flex gap-2 border-t border-slate-200 p-3">
        <label htmlFor="demo-message" className="sr-only">
          Try a message in the demonstration
        </label>
        <Input
          id="demo-message"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Try a question. Only the prepared examples have answers."
          className="h-11 md:text-sm"
        />
        <Button type="submit" className="h-11 rounded-full px-4">
          Send
        </Button>
      </form>
    </div>
  )
}
