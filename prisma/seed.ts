import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  console.log("Seeding FAQ entries for NovaTech demo...");

  await db.faqEntry.deleteMany();

  await db.faqEntry.createMany({
    data: [
      {
        category: "hr",
        question: "What is the vacation policy?",
        answer:
          "Full-time employees receive 20 days of paid vacation per year, accrued monthly. Unused days roll over up to a maximum of 30 days.",
      },
      {
        category: "hr",
        question: "How do I request time off?",
        answer:
          "Submit a time-off request through the HR portal at least 5 business days in advance for planned leave. For sick leave, notify your manager by 9 AM on the day of absence.",
      },
      {
        category: "benefits",
        question: "What health insurance options are available?",
        answer:
          "NovaTech offers three tiers: Basic (employee-only), Standard (employee + spouse), and Family (all dependents). Coverage begins on your first day. Open enrollment is every November.",
      },
      {
        category: "benefits",
        question: "Is there a remote work stipend?",
        answer:
          "Yes. Remote and hybrid employees receive $750/year toward home office equipment, paid as a reimbursement. Submit receipts to finance@novatech.example.",
      },
      {
        category: "it",
        question: "How do I reset my password?",
        answer:
          "Go to accounts.novatech.example/reset or contact IT helpdesk at ext. 4357 (HELP). Self-service resets are available 24/7.",
      },
      {
        category: "it",
        question: "What is the approved software list?",
        answer:
          "All software must be approved by IT before installation. See the approved software catalogue in the IT wiki. For new requests, open a ticket via it-helpdesk@novatech.example.",
      },
      {
        category: "onboarding",
        question: "What happens in the first week?",
        answer:
          "Week 1 includes: equipment setup, IT orientation, HR paperwork, a team intro meeting, and a 1-on-1 with your manager. Your buddy will reach out on day 1 to help you get settled.",
      },
    ],
  });

  console.log("Seeded 7 FAQ entries.");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
