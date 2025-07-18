// components/FAQ.js
export default function FAQ() {
  const faqs = [
    {
      question: "What is ITAN?",
      answer:
        "ITAN is an Afrocentric bookstore and literary marketplace bringing African fiction to readers worldwide. We curate a wide range of premium, and original Black stories—delivered as ebooks, serials, and immersive audiobooks.",
    },
    {
      question: "How do I access ITAN books?",
      answer:
        "You can access ITAN books through one-time purchase or, soon, with a subscription service. Subscribers become part of ITAN UNBOUND—an inclusive gateway to endless bestselling Black fiction, available for download into your personal library to devour at your pace.\n\nWith ITAN UNBOUND, you can download and read limitless best-selling Black fiction books. Subscribers can access thousands of books bundled as part of ITAN Unbound, available on iPhone, iPad, Android phone, PC, or tablet using the ITAN app.",
    },
    {
      question: "On which devices can I read ITAN books?",
      answer:
        "Sign in with your ITAN account to start reading in the ITAN app or on your computer, or any internet-connected device with smartphones, tablets, desktops and iPhones. Take ITAN with you, no matter where life takes you.",
    },
    {
      question: "Is ITAN great for children?",
      answer:
        "ITAN children’s experience is included with your membership, giving parents control while kids enjoy adventure stories, picture books, and other age-appropriate content in their own space.",
    },
    {
      question: "How do I cancel?",
      answer:
        "ITAN gives you total flexibility - no contracts, no commitments. Cancel anytime online, with zero cancellation fees. You are in control, always.",
    },
  ];

  return (
    <section className="bg-[#000000] text-white py-16 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Frequently Asked Questions
        </h2>
        <p className="text-center mb-12 text-lg text-gray-300">
          Stuck on something? We're here to help with all your questions and
          answers in one place.
        </p>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-[0.5px] border-red-500 flex items-start gap-4 bg-gradient-to-br from-[#181818] via-[#393939] to-[#232526] p-6 rounded-lg"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-md bg-black text-white flex items-center justify-center font-semibold">
                {index + 1}
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">{faq.question}</h3>
                <p className="text-gray-200 whitespace-pre-line">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
