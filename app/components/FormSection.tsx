import React from 'react';
import { Form, useActionData } from 'react-router';
import { action as formAction } from '../routes/index';

const FormSection: React.FC = () => {
const actionData = useActionData<typeof formAction>();

  return (
    <section
      id="get-involved"
      className="p-6 md:p-8 rounded-xl shadow-md mb-8 max-w-xl mx-auto border-gradient w-full"
    >
      <h2 className="text-2xl font-bold text-[var(--text-secondary)] mb-2">Get Involved</h2>
      <Form method="post"> 
        <div className="mb-4">
          <label htmlFor="name" className="block mb-1 font-medium">Name:</label>
          <input
            type="text"
            id="name"
            autoComplete="name"
            name="name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-1 font-medium">Email:</label>
          <input
            type="email"
            id="email"
            autoComplete="email"
            name="email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="postalCode" className="block mb-1 font-medium">Postal Code:</label>
          <input
            type="text"
            id="postalCode"
            autoComplete="postal-code"
            name="postalCode"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="block mb-1 font-medium">Message:</label>
          <textarea
            id="message"
            autoComplete="off"
            name="message"
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <button
          type="submit"
          className="bg-red-600 hover:bg-red-800 text-white font-semibold px-5 py-2 rounded-md transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Send Message
        </button>
      </Form>
      {actionData && (
        <div
          className={`mt-4 px-4 py-3 rounded-md text-sm font-medium ${
            actionData.success
                ? 'bg-green-100 text-green-800 border border-green-300'
              : 'bg-red-100 text-red-800 border border-red-300'
          }`}
        >
          {actionData.error || 'An unknown error occurred'}
        </div>
      )}
    </section>
  );
};

export default FormSection; 