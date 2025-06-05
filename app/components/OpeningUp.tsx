import React from 'react';
import { FaDoorOpen } from 'react-icons/fa';

const OpeningUp: React.FC = () => (
  <section className="mb-12">
    <div className="flex flex-col md:flex-row items-center  bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--box-background)] rounded p-8 gap-8">
      <div className="flex-1 flex flex-col items-center md:items-start mb-4 md:mb-0">
        <FaDoorOpen className="text-5xl text-[var(--color-primary)] mb-4" />
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-secondary)] mb-2 text-center md:text-left">Opening Up Our Party</h2>
      </div>
      <ul className="flex-1 list-disc ml-5 text-[var(--text-primary)] space-y-4">
        <li>Open, condensed leadership selection in 2026, open to all OLP members</li>
        <li>Draft nomination plan to nominate all candidates by December 2027, outlining steps for a full slate of <em>local champions</em></li>
        <li>Policy and platform convention in 2027, to inform the policies Ontario Liberals want to see in our 2029 campaign.</li>
      </ul>
    </div>
  </section>
);

export default OpeningUp; 