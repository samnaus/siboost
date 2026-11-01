import type { SiteContent } from "@/lib/content/types"

export const defaultSiteContent: SiteContent = {
  business: {
    name: "Siboost",
    tagline: "Websites built for the way people search now.",
    email: "hello@siboost.co.nz",
    country: "New Zealand",
  },
  seo: {
    homeTitle: "Websites built for the way people search now",
    homeDescription:
      "Siboost upgrades New Zealand business websites for AI-assisted discovery and helps turn more visitors into enquiries. Packages from $1,999 excl. GST.",
    packagesTitle: "Packages and pricing",
    packagesDescription:
      "SI Ready, SI Boost and SI Complete. One-off website projects in NZD, excluding GST, with optional monthly care and AI assistant subscriptions.",
    agentsTitle: "AI sales agents",
    agentsDescription:
      "A branded website assistant that answers questions, qualifies enquiries and collects contact details. See a clearly labelled demonstration.",
    readinessTitle: "AI search readiness",
    readinessDescription:
      "How Siboost prepares an existing website so people and AI assistants can understand the business. No guaranteed rankings or recommendations.",
    howTitle: "How it works",
    howDescription:
      "Submit your website, we review it, we upgrade what we agree, and you can choose ongoing care as search tools change.",
    aboutTitle: "About Siboost",
    aboutDescription:
      "Siboost is a New Zealand business helping small and medium-sized companies keep their websites discoverable and useful.",
    contactTitle: "Contact",
    contactDescription:
      "Ask about a website upgrade, a consultation, or the AI sales assistant. We aim to reply within two business days.",
  },
  hero: {
    eyebrow: "New Zealand website upgrades",
    headline: "Search has changed. Is your website ready?",
    subheadline:
      "We upgrade business websites for the AI era, helping customers discover your business through modern search while turning more website visitors into enquiries.",
    primaryCta: "Explore Packages",
    secondaryCta: "Check My Website",
  },
  searchShift: {
    eyebrow: "The shift",
    headline: "Your customers are searching differently.",
    intro:
      "For a long time, a customer searched Google, opened a handful of websites and chose who to contact. Many people still do that. Alongside it, customers now ask AI assistants such as ChatGPT, Gemini and Google AI Search to research, compare and discover businesses.",
    traditionalTitle: "Traditional search",
    traditional: [
      "Customer searches Google.",
      "Customer browses websites.",
      "Customer compares businesses.",
      "Customer makes an enquiry.",
    ],
    aiTitle: "AI-powered discovery",
    ai: [
      "Customer asks an AI assistant.",
      "AI gathers relevant business information.",
      "AI presents answers and recommendations.",
      "Customer contacts or visits a business.",
    ],
    note: "Google search has not disappeared. A website still needs to work for people on their phones, for traditional search, and for the AI tools that read the same pages. Siboost helps the site stay clear and useful across those paths. It does not guarantee that any assistant will rank, recommend or mention your business.",
  },
  pillars: {
    eyebrow: "The work",
    headline: "What Siboost does",
    intro: "Four kinds of work. You can start with readiness alone, or go further into the website and an assistant.",
    items: [
      {
        title: "AI Search Readiness",
        body: "Improve website structure, technical accessibility, structured data and content clarity to support AI-driven discovery.",
      },
      {
        title: "Website Modernisation",
        body: "Improve website design, speed, mobile usability and conversion performance.",
      },
      {
        title: "AI Sales Agents",
        body: "Deploy branded website assistants that answer questions, qualify leads, collect contact information and support bookings.",
      },
      {
        title: "Ongoing Optimisation",
        body: "Monitor discoverability, improve content and maintain website and AI agent performance.",
      },
    ],
  },
  packagesIntro: {
    eyebrow: "Packages",
    headline: "Clear project fees. Optional monthly care.",
    intro: "All prices are in New Zealand dollars and exclude GST. GST at 15% is shown before you pay. Choose a one-off package, then add a subscription only if you want ongoing help or a hosted assistant.",
  },
  subscriptionsIntro: {
    eyebrow: "Monthly",
    headline: "Subscriptions, when the work needs to continue",
    intro: "Subscriptions are optional where the project can stand alone. A hosted AI assistant needs an active SI Agent subscription to keep running. You can buy the subscriptions on their own, or with a package.",
    combinedLabel: "SI Care + SI Agent",
    combinedBody:
      "Website care and the assistant together. The monthly total is the two subscriptions added up, plus GST.",
  },
  comparison: {
    headline: "Compare the packages",
    intro: "SI Boost includes SI Ready. SI Complete includes SI Boost. Page limits apply to existing pages unless a redesign scope says otherwise.",
    rows: [
      { feature: "AI-readiness website audit", ready: "Included", boost: "Included", complete: "Included" },
      { feature: "Technical SEO and crawlability review", ready: "Included", boost: "Included", complete: "Included" },
      { feature: "Structured data", ready: "Basic", boost: "Advanced", complete: "Advanced" },
      { feature: "Pages optimised", ready: "Up to 5", boost: "Up to 15", complete: "Up to 25" },
      { feature: "Business information review", ready: "Included", boost: "Included", complete: "Included" },
      { feature: "AI search visibility assessment", ready: "Basic", boost: "Baseline report", complete: "Comprehensive" },
      { feature: "llms.txt where appropriate and supported", ready: "Included", boost: "Included", complete: "Included" },
      { feature: "Website improvement report", ready: "Included", boost: "Included", complete: "Included" },
      { feature: "Website design", ready: "—", boost: "Design refresh", complete: "Redesign, agreed scope" },
      { feature: "Mobile usability", ready: "—", boost: "Improvements", complete: "Comprehensive" },
      { feature: "Speed and performance", ready: "—", boost: "Optimisation", complete: "Comprehensive" },
      { feature: "Enquiry forms and conversion", ready: "—", boost: "Improvements", complete: "Advanced layouts" },
      { feature: "AI-focused FAQ content", ready: "—", boost: "Included", complete: "Included" },
      { feature: "Competitor discovery analysis", ready: "—", boost: "Included", complete: "Included" },
      { feature: "Google Business Profile", ready: "—", boost: "Optimisation", complete: "Optimisation" },
      { feature: "AI sales agent", ready: "—", boost: "Setup", complete: "Advanced configuration" },
      { feature: "Lead capture and qualification", ready: "—", boost: "Included", complete: "Included" },
      { feature: "Booking or CRM", ready: "—", boost: "Basic integration", complete: "Advanced integrations" },
      { feature: "Extra approved knowledge sources", ready: "—", boost: "—", complete: "Included" },
      { feature: "Automated lead follow-up", ready: "—", boost: "—", complete: "Setup" },
      { feature: "Launch testing and handover", ready: "—", boost: "—", complete: "Included" },
    ],
  },
  agent: {
    eyebrow: "AI sales agents",
    headline: "Meet your new 24/7 AI sales assistant.",
    subheadline:
      "Turn your website into a smarter sales channel with an AI assistant trained on your approved business information.",
    capabilities: [
      "Answer frequently asked customer questions",
      "Explain services and products",
      "Qualify potential customers",
      "Collect contact details with consent",
      "Help customers schedule appointments",
      "Notify the business of new enquiries",
      "Hand off complex conversations to staff",
      "Work outside normal business hours",
    ],
    demoTitle: "See a scripted example",
    demoDisclaimer:
      "Demonstration only. This is a scripted conversation, not a live assistant, and not a real customer conversation. Nothing you type here is saved as an enquiry.",
    demoBusiness: "Fictional home builder, used only as an example",
    script: [
      {
        prompt: "What areas do you work in?",
        user: "What areas do you work in?",
        assistant:
          "This example business takes projects across Christchurch and wider Canterbury. A live assistant would answer from the service area you approve, in your own words.",
      },
      {
        prompt: "Can I book a site visit?",
        user: "Can I book a site visit?",
        assistant:
          "I can collect a preferred day, plus your name, email and phone, and pass that to the team. In a live installation the team confirms the time. This demonstration cannot book anything.",
      },
      {
        prompt: "How much does a new build cost?",
        user: "How much does a new build cost?",
        assistant:
          "A live assistant would only share price guidance you have approved. That figure is not part of this demonstration, so the next step would be to take the enquiry for the team.",
      },
      {
        prompt: "Please ask the team to call me",
        user: "Please ask the team to call me",
        assistant:
          "A live assistant would ask for your name, phone number, consent to be contacted, and a good time to call, then notify the business. This demonstration does not store those details.",
      },
    ],
    fallbackReply:
      "This demonstration only includes the prepared examples above. A live assistant, once connected, would answer from your approved business information or hand the question to your team.",
    providerNote:
      "SI Agent is designed to run on an established third-party AI agent platform with suitable white-label or agency options. No specific provider integration is operational on this website yet. We will name the platform only after it is implemented and checked.",
  },
  howItWorks: {
    eyebrow: "Process",
    headline: "How it works",
    intro: "A straightforward project. We agree the scope before any design or technical work starts.",
    steps: [
      {
        title: "Submit your website",
        body: "Tell us about your business and the website you already have. A readiness check or a contact form is enough to begin.",
      },
      {
        title: "We review it",
        body: "We assess website structure, search readiness, usability and the improvement opportunities that are worth doing.",
      },
      {
        title: "We upgrade it",
        body: "We implement the agreed improvements and configure any AI features you have chosen. You see the scope before we build it.",
      },
      {
        title: "Stay ahead",
        body: "Choose ongoing management if you want the website, and any assistant, looked after as the tools change.",
      },
    ],
  },
  readiness: {
    eyebrow: "Readiness check",
    headline: "Is your website AI ready?",
    intro:
      "Send us your website and we will look at it. This is a request for a human review, not an instant audit and not a score.",
    looksAt: [
      "Whether important pages can be reached and read",
      "Whether the business, services and location are stated clearly",
      "Whether basic structured information is present",
      "How the site behaves on a phone",
      "Where an enquiry path is missing or unclear",
    ],
    notIncluded:
      "You will not receive an automated score, a fabricated audit, or a claim that an AI assistant will recommend the business. If we need a paid audit to go deeper, we will say so.",
    successTitle: "We've received your website.",
    successBody:
      "A person at Siboost will review what you sent and reply by email. This form does not generate an automated score or a readiness report on its own.",
  },
  faqs: [
    {
      question: "Will this make ChatGPT or Google recommend my business?",
      answer:
        "No. We improve how clearly your website can be accessed and understood, and how easily a visitor can enquire. Nobody can honestly guarantee that an AI assistant will rank, recommend or mention a business.",
    },
    {
      question: "Has Google search stopped mattering?",
      answer:
        "No. Many customers still search Google, browse websites and compare businesses themselves. AI assistants are an extra way people research. A useful website needs to work for both.",
    },
    {
      question: "Are the prices inclusive of GST?",
      answer:
        "No. Prices on this site are in New Zealand dollars and exclude GST. Where GST applies, 15% is calculated and shown before you pay.",
    },
    {
      question: "Do I have to take a monthly subscription?",
      answer:
        "SI Ready, SI Boost and SI Complete are one-off project fees. SI Care is optional ongoing management. If you want a hosted AI assistant to stay online after setup, you need an active SI Agent subscription.",
    },
    {
      question: "What is llms.txt?",
      answer:
        "It is a plain text file some AI systems may request. It can summarise a business. It does not replace a crawlable website, useful content, structured data or ordinary SEO. Where it is appropriate and supported, we can add one as part of a package. It is not the whole job.",
    },
    {
      question: "Is the chat on this website a live sales agent?",
      answer:
        "No. The conversation on this site is a scripted demonstration so you can see the idea. It is not connected to an AI model, and it does not save what you type as an enquiry.",
    },
    {
      question: "What happens to the details I submit?",
      answer:
        "We use them to reply and, if you become a customer, to deliver the work and take payment. Card numbers are handled by Stripe. We do not store them. The privacy policy explains this in more detail and is marked as a draft for legal review.",
    },
    {
      question: "Who is Siboost for?",
      answer:
        "Small and medium-sized New Zealand businesses, including professional services, trades, home builders and local service businesses that already have a website.",
    },
  ],
  about: {
    eyebrow: "About",
    headline: "A New Zealand business, focused on the website you already have.",
    paragraphs: [
      "Siboost helps businesses prepare their websites for the way customers search now. That means clearer pages, a site that people can use on a phone, information that AI systems can access, and, when you want it, an assistant that can take an enquiry after hours.",
      "The company is led by Sam Naus and works with New Zealand clients. We would rather explain a limit than imply a result we cannot promise.",
      "If your website is the main place customers learn what you do, it should say that plainly, load properly, and give people an obvious way to get in touch. That is the work.",
    ],
    audience: [
      "Professional services",
      "Trades",
      "Home builders",
      "Local service businesses",
      "Other small and medium-sized businesses",
    ],
  },
  contact: {
    eyebrow: "Contact",
    headline: "Tell us about the website.",
    intro: "Send a general message or ask for a consultation. We read these ourselves.",
    response: "We aim to reply within two business days.",
  },
  privacy: {
    sections: [
      {
        heading: "Draft for legal review",
        paragraphs: [
          "This privacy policy is a working draft for a New Zealand business. It is not legal advice and should be reviewed by a lawyer before the business relies on it. It is written with the Privacy Act 2020 and the information privacy principles in mind.",
        ],
      },
      {
        heading: "Who we are",
        paragraphs: [
          "Siboost is a New Zealand business led by Sam Naus. In this policy, “we” means Siboost. Registered company details will be confirmed on invoices and in the final legal terms. You can contact us at the email address published on this website.",
        ],
      },
      {
        heading: "What we collect",
        paragraphs: [
          "If you send an enquiry or a readiness check, we collect the details you type: your name, email address, business name, website address, phone number if you provide one, the package you are interested in, and your message. We also store that you gave consent.",
          "If you pay, Stripe collects payment card details, billing address and any tax identifier you enter. We store the payment status, amounts, currency and Stripe customer and subscription identifiers. We do not store card numbers.",
          "Our hosting provider may keep technical logs such as IP address, browser type and the pages requested. If analytics is switched on later, we will name the provider here. It is not loaded unless it is configured.",
        ],
      },
      {
        heading: "Why we collect it",
        paragraphs: [
          "We collect enquiry details to reply, prepare a proposal and deliver the work you ask for. We collect payment details through Stripe to take payment, issue invoices and manage subscriptions. We use technical logs to keep the site secure and to understand basic reliability.",
          "We do not sell personal information. We do not use the readiness form to generate a secret score about your website.",
        ],
      },
      {
        heading: "Who we share it with",
        paragraphs: [
          "We share information with service providers only as needed to run the business: Stripe for payments, an email provider such as Resend or Postmark when email is configured, and the hosting provider for this website. A bookkeeper or professional adviser may see invoices. We may disclose information if the law requires it.",
          "Some of those providers store data outside New Zealand. Under the Privacy Act 2020 we will only disclose personal information overseas when we believe the recipient is subject to comparable privacy safeguards, or you authorise the disclosure, or another permitted ground applies. The final policy should name the countries once the providers are fixed.",
        ],
      },
      {
        heading: "How long we keep it",
        paragraphs: [
          "We keep enquiry and project records for as long as we need them to do the work, handle a complaint, or meet tax and accounting duties. You can ask us to delete an enquiry if we no longer need it. Payment records are kept for the period New Zealand tax law requires.",
        ],
      },
      {
        heading: "Access and correction",
        paragraphs: [
          "You may ask for access to the personal information we hold about you, and ask us to correct it if it is wrong. Contact us using the email on this website. If you are not satisfied with our response, you can contact the Office of the Privacy Commissioner.",
        ],
      },
      {
        heading: "Cookies",
        paragraphs: [
          "The public site does not need an account. An admin session cookie is used only for the private admin area. Stripe may set cookies on its own checkout and billing pages. Optional analytics cookies are not set unless an analytics provider is configured.",
        ],
      },
      {
        heading: "Security",
        paragraphs: [
          "We use HTTPS, restrict admin access, and avoid storing card details. No method of transmission or storage is perfectly secure. Please do not send passwords or payment card numbers through the contact form.",
        ],
      },
    ],
  },
  terms: {
    sections: [
      {
        heading: "Draft for legal review",
        paragraphs: [
          "These terms are a sensible starting draft for a New Zealand business-to-business service. They are not legal advice. Have them reviewed before you rely on them, especially the liability, GST and consumer-law clauses.",
        ],
      },
      {
        heading: "The service",
        paragraphs: [
          "Siboost upgrades existing business websites and can set up a branded website assistant. The package pages describe what is included. The work we actually do is the scope we confirm with you in writing before we start. A website redesign is limited to that agreed scope.",
          "We do not guarantee that any search engine or AI assistant will rank, recommend, mention or send enquiries to your business. Reports and assessments describe what we observed. They are not a promise of future results.",
        ],
      },
      {
        heading: "Fees and GST",
        paragraphs: [
          "Package prices on this website are in New Zealand dollars and exclude GST. Where Siboost is GST-registered and GST applies, 15% GST is added and shown before payment. Confirm GST registration with an accountant before live charges are switched on.",
          "Project fees are payable as agreed at checkout or on invoice. Monthly subscriptions renew until you cancel. Fair-use limits for SI Care and SI Agent are described on the package pages and in the product notes. Work outside those limits is quoted separately.",
        ],
      },
      {
        heading: "Subscriptions",
        paragraphs: [
          "SI Care and SI Agent are monthly subscriptions. You can manage the payment method, invoices and cancellation in the Stripe customer portal. Cancellation takes effect at the end of the current billing period unless we agree otherwise.",
          "A hosted assistant needs an active SI Agent subscription. If the subscription ends, we may switch the assistant off. Setup work already delivered as part of a package remains delivered. We do not claim a named third-party agent platform is connected until that integration is in place and checked.",
        ],
      },
      {
        heading: "Your responsibilities",
        paragraphs: [
          "You will give us accurate business information, timely access to the website, and the right to use the copy and assets you supply. You are responsible for the claims made about your own business. The assistant may only be given information you are willing for customers to hear.",
        ],
      },
      {
        heading: "Acceptable use of an assistant",
        paragraphs: [
          "The assistant must not be used to mislead customers, invent credentials, hide material terms, or collect information without a proper privacy notice. We may pause an assistant that is being used that way.",
        ],
      },
      {
        heading: "Intellectual property",
        paragraphs: [
          "You keep ownership of your existing website content and brand. We keep ownership of our methods, templates and tools. On payment, you receive a licence to use the deliverables for your business. Third-party software, fonts, images and agent platforms stay under their own licences.",
        ],
      },
      {
        heading: "Liability",
        paragraphs: [
          "To the extent the law allows, Siboost is not liable for lost profits, lost enquiries, or search or AI outcomes. Our total liability for a claim about a project is limited to the fees you paid us for that project in the three months before the claim.",
          "Nothing in these terms excludes rights that cannot be excluded under the Consumer Guarantees Act 1993 or the Fair Trading Act 1986. Many of our clients are in trade and acquire the services for a business purpose. Where it is fair and reasonable, and the law allows, those statutes are contracted out of for business clients. This clause needs legal review for your actual customers.",
        ],
      },
      {
        heading: "New Zealand law",
        paragraphs: [
          "These terms are governed by New Zealand law. The courts of New Zealand have jurisdiction. If a clause is unenforceable, the rest remains in effect.",
        ],
      },
    ],
  },
}
