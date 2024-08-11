import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form"
import { Input } from "@components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const generateTemplate = ({ amount, reasoning }: any) => {
    return `;; Reasoning: 
;; ${reasoning}

(impl-trait 'SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.dao-traits-v2.proposal-trait)

(define-constant cha-amount (* u${amount} (pow u10 u6)))
(define-constant target-farm 'SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.abundant-orchard)

(define-public (execute (sender principal))
	(contract-call? 'SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.fuji-helper-v1 restock cha-amount target-farm)
)
`}

const proposalFormSchema = z.object({
    amount: z.coerce.number().min(1).max(100000),
    reasoning: z.string().min(1, "Reasoning is required"),
})

type ProposalFormValues = z.infer<typeof proposalFormSchema>

export default function RestockFarmsTemplate({ onFormChange }: any) {
    const defaultValues: Partial<ProposalFormValues> = {
        amount: 0,
        reasoning: "",
    }

    const form = useForm<ProposalFormValues>({
        resolver: zodResolver(proposalFormSchema),
        defaultValues,
        mode: "onChange",
    })

    const handleChange = () => {
        const template = generateTemplate(form.getValues())
        onFormChange(template)
    };

    return (
        <Form {...form}>
            <form onChange={handleChange}>
                <fieldset className="grid grid-cols-1 gap-4 rounded-lg border p-4">
                    <legend className="-ml-1 px-1 text-sm font-medium">
                        Proposal Details
                    </legend>
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Number of tokens to mint and distribute to the staking pool</FormLabel>
                                    <FormControl>
                                        <Input placeholder={'Amount of tokens'} type="number" min={1} max={100000} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="reasoning"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Reasoning for this disbursement</FormLabel>
                                    <FormControl>
                                        <Input placeholder={'...'} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </fieldset>
            </form>
        </Form>
    )
}