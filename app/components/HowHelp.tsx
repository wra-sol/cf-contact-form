import { FaTwitter, FaFacebook, FaLinkedin, FaWhatsapp, FaEnvelope } from 'react-icons/fa';

const HowHelp = ({site_url}: {site_url: string}) => (
  <section className="mb-12" id="get-involved">
    <div className="bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--box-background)] rounded p-8 flex flex-col items-center">
      <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-secondary)] mb-4 text-center">How Can You Help?</h2>
      <ul className="list-disc ml-5 text-[var(--text-primary)] space-y-4 mb-6 max-w-xl">
        <li><strong>SIGN UP</strong> – Let us know you are interested in advancing these priorities in our party, and confirm your party membership. <a href="#get-involved" className="text-[var(--text-secondary)] underline">Click here to sign up.</a></li>
        <li>
          <strong>HELP US GROW</strong> – We need to grow our membership, and we need your help to do it. Share this page with your friends and family who care about Ontario's future.
          <div className="mt-3 flex flex-wrap gap-4 justify-center">
            <a href={`https://twitter.com/intent/tweet?text=Join%20me%20in%20supporting%20New%20Leaf%20Liberals%20-%20helping%20shape%20the%20future%20of%20the%20Ontario%20Liberal%20Party&url=${site_url}`}
               target="_blank"
               rel="noopener noreferrer"
               className="text-[var(--text-secondary)] hover:text-[var(--text-tertiary)] text-2xl transition-colors"
               aria-label="Share on Twitter">
              <FaTwitter />
            </a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${site_url}`}
               target="_blank"
               rel="noopener noreferrer"
               className="text-[var(--text-secondary)] hover:text-[var(--text-tertiary)] text-2xl transition-colors"
               aria-label="Share on Facebook">
              <FaFacebook />
            </a>
            <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${site_url}&title=New%20Leaf%20Liberals&summary=Join%20me%20in%20supporting%20New%20Leaf%20Liberals%20-%20helping%20shape%20the%20future%20of%20the%20Ontario%20Liberal%20Party`}
               target="_blank"
               rel="noopener noreferrer"
               className="text-[var(--text-secondary)] hover:text-[var(--text-tertiary)] text-2xl transition-colors"
               aria-label="Share on LinkedIn">
              <FaLinkedin />
            </a>
            <a href={`https://api.whatsapp.com/send?text=Join%20me%20in%20supporting%20New%20Leaf%20Liberals%20-%20helping%20shape%20the%20future%20of%20the%20Ontario%20Liberal%20Party%20${encodeURIComponent(site_url)}`}
               target="_blank"
               rel="noopener noreferrer"
               className="text-[var(--text-secondary)] hover:text-[var(--text-tertiary)] text-2xl transition-colors"
               aria-label="Share on WhatsApp">
              <FaWhatsapp />
            </a>
            <a href={`mailto:?subject=Join%20me%20in%20supporting%20New%20Leaf%20Liberals&body=Check%20out%20this%20page%3A%20${encodeURIComponent(site_url)}`}
               className="text-[var(--text-secondary)] hover:text-[var(--text-tertiary)] text-2xl transition-colors"
               aria-label="Share by Email">
              <FaEnvelope />
            </a>
          </div>
        </li>
        <li><strong>SHOW UP</strong> – Get to the AGM in <a href='https://ontarioliberal.ca/agm/' target='_blank' rel='noopener noreferrer' className='text-[var(--text-secondary)] underline'>Toronto at the Sheraton Centre, from September 12-14, 2025.</a></li>
        <li><strong>VOTE</strong> – Vote for the change you want to see at the OLP</li>
      </ul>
      <a href="#get-involved" className="inline-block bg-[var(--color-primary)] hover:bg-[var(--text-secondary)] text-white font-bold py-3 px-8 rounded shadow-lg transition-colors duration-200 text-lg mt-2">
        Sign Up Now
      </a>
    </div>
  </section>
);

export default HowHelp; 