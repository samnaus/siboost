import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import type { Faq } from "@/lib/content/types"

export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <Accordion className="divide-y divide-slate-200">
      {faqs.map((faq) => (
        <AccordionItem key={faq.question} value={faq.question} className="border-slate-200">
          <AccordionTrigger className="py-4 text-base font-semibold text-[#0f172a] hover:no-underline">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-base leading-7 text-slate-600">{faq.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
