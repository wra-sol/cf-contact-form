import React from 'react';
import { FaUsers, FaChalkboardTeacher, FaDatabase, FaCity } from 'react-icons/fa';

const items = [
  {
    icon: <FaUsers className="text-3xl text-[var(--color-primary)] mb-2" />,
    title: 'Empower Local Associations',
    desc: 'More funding and better support for PLAs, doubling field organizer roles.'
  },
  {
    icon: <FaChalkboardTeacher className="text-3xl text-[var(--color-primary)] mb-2" />,
    title: 'Expand Leadership',
    desc: 'Doubling the size of the Provincial Council to include newer voices in our party leadership.'
  },
  {
    icon: <FaDatabase className="text-3xl text-[var(--color-primary)] mb-2" />,
    title: 'Modernize Tools',
    desc: 'Centralizing and updating our voter ID and volunteer management systems.'
  },
  {
    icon: <FaCity className="text-3xl text-[var(--color-primary)] mb-2" />,
    title: 'Build the Bench',
    desc: 'Supporting Ontario Liberals in municipal races in 2026 to build a bench of trained and experienced Candidates, Staff, and Volunteers.'
  }
];

const Grow: React.FC = () => (
  <section className="mb-12">
    <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-secondary)] mb-8 text-center">Grow through the Grassroots</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {items.map((item, idx) => (
        <div key={idx} className="flex flex-col items-center bg-[var(--box-background)] rounded  p-6 text-center">
          {item.icon}
          <div className="font-semibold text-lg mb-2 text-[var(--text-secondary)]">{item.title}</div>
          <div className="text-[var(--text-primary)] text-base">{item.desc}</div>
        </div>
      ))}
    </div>
  </section>
);

export default Grow; 