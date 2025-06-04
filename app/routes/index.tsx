import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Grow from '../components/Grow';
import OpeningUp from '../components/OpeningUp';
import FAQ from '../components/FAQ';
import HowHelp from '../components/HowHelp';
import FormSection from '../components/FormSection';

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const name = formData.get('name');
  const email = formData.get('email');
  const postalCode = formData.get('postalCode');
  const message = formData.get('message');
 try {
  const response = await fetch('/api/submit', {
    method: 'POST',
    body: JSON.stringify({ name, email, postalCode, message }),
  });
  if (!response.ok) {
    throw new Error('Failed to submit form');
  } else {  
    return { success: true };
  }
 } catch (error) {
  return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' };
 }
}   

const Home: React.FC = () => (
  <>
    <Header />
    <Hero />
    <Grow />
    <OpeningUp />
    <FormSection />
    <FAQ />
    <HowHelp />
  </>
);

export default Home; 