import React, { useState } from 'react';

const faqs = [
  {
    q: 'Who are you? Who are New Leaf Liberals?',
    a: `We're card carrying, rank-and-file Ontario Liberals. We don't support any particular leadership candidate, and we aren't funded whatsoever. We've come together to brainstorm a new direction for our party, and hope you will see value in the future we envision for the OLP.`
  },
  {
    q: 'Are you supported by a potential leadership candidate?',
    a: `No. We're an open group of Ontario Liberals, connected by our mutual hope to reform our party and form government in 2029.`
  },
  {
    q: 'Why do you want an open leadership contest in 2026?',
    a: `We believe that an open and condensed leadership contest can attract new talent, new members, and new funds to our party. We want to see a wide field of candidates, who, win or lose, will be committed to building a party that can win in 2029. It shouldn't be a Bonnie or not Bonnie question, it needs to be "Who's best to lead our party into 2029?".`
  },
  {
    q: `Is this mostly to do with Bonnie Crombie's leadership review?`,
    a: `The problems we've outlined have existed in our party long before Bonnie was elected leader. While we are encouraging an open contest for leader, we've also created a list of other priorities that are equally as important, no matter who our party leader is.`
  }
];

const FAQ: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <section className="mb-12">
      <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-secondary)] mb-8 text-center">FAQ</h2>
      <div className="flex flex-col gap-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-[var(--box-background)] rounded overflow-hidden">
            <button
              className="w-full text-left px-6 py-4 font-semibold text-[var(--text-secondary)] dark:text-[var(--text-primary)] text-lg focus:outline-none flex justify-between items-center"
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              aria-expanded={openIdx === idx}
            >
              {faq.q}
              <span className={`ml-2 transition-transform duration-200 ${openIdx === idx ? 'rotate-90' : ''}`}>▶</span>
            </button>
            {openIdx === idx && (
              <div className="px-6 pb-4 text-[var(--text-primary)] animate-fade-in">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ; 