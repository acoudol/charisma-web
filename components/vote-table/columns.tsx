"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Info, MoreHorizontal } from "lucide-react"

import { Button } from "@components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@components/ui/dropdown-menu"
import ContractCallVote from "./voting"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@components/ui/tooltip"
import SyntaxHighlighter from 'react-syntax-highlighter';
import ReclaimVotes from "./reclaim-votes"
import Conclude from "./conclude"


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Proposal = {
    id: string
    source: string
    amount: number
    status: "Pending" | "Passed" | "Voting Active" | "Voting Ended" | "Failed"
    name: string
    url: string
}

export const columns: ColumnDef<Proposal>[] = [
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            let style;
            if (row.original.status === 'Pending') {
                style = 'text-yellow-500 animate-pulse'
            } else if (row.original.status === 'Passed') {
                style = 'text-green-500'
            } else if (row.original.status === 'Voting Active') {
                style = 'text-red-500 animate-pulse'
            } else {
                style = 'text-gray-500'
            }
            return <div className={style}>{row.original.status}</div>
        }
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Contract Address
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger><div className='flex items-center gap-1'><div className={`text-left hover:text-muted-foreground`}>{row.getValue("name")}</div></div></TooltipTrigger>
                        <TooltipContent className={`max-w-[99vw] max-h-[80vh] overflow-scroll bg-black text-white border-primary leading-tight shadow-2xl`}>
                            <SyntaxHighlighter language="lisp" customStyle={{ background: 'black' }} wrapLongLines={true}>
                                {row.original.source}
                            </SyntaxHighlighter>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )
        }
    },
    {
        accessorKey: "startBlockHeight",
        header: () => <div className="text-right">Voting Starts</div>,
        cell: ({ row }) => {
            const startBlockHeight = parseFloat(row.getValue("startBlockHeight"))

            return <div className="text-right font-medium">{startBlockHeight}</div>
        },

    },
    {
        accessorKey: "endBlockHeight",
        header: () => <div className="text-right">Voting Ends</div>,
        cell: ({ row }) => {
            const endBlockHeight = parseFloat(row.getValue("endBlockHeight"))

            return <div className="text-right font-medium">{endBlockHeight}</div>
        },

    },
    {
        accessorKey: "amount",
        header: () => <div className="text-right">Votes For</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("amount"))

            return <div className="text-right font-medium">{amount / Math.pow(10, 6)}</div>
        },

    },
    {
        accessorKey: "against",
        header: () => <div className="text-right">Votes Against</div>,
        cell: ({ row }) => {
            const against = parseFloat(row.getValue("against"))

            return <div className="text-right font-medium">{against / Math.pow(10, 6)}</div>
        },

    },
    {
        id: "actions",
        cell: ({ row }) => {
            const proposal = row.original

            if (proposal.status === 'Passed' || proposal.status === 'Failed' || proposal.status === 'Voting Ended') {
                return <>
                    <Conclude proposalPrincipal={proposal.name} />
                    <ReclaimVotes proposalPrincipal={proposal.name} />
                </>
            } else if (proposal.status === 'Voting Active') {
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost">
                                Vote
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Cast Vote</DropdownMenuLabel>
                            <ContractCallVote proposalPrincipal={proposal.name} />
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => window.open(proposal.url)}>View proposal</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            }
        },
    },
]
