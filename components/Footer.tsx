import Link from 'next/link';
import DonateButton from './DonateButton';

export default function Footer() {
  return (
    <footer className="relative z-50 border-t border-border bg-accent/50 mt-12 pb-12">
      <div className="container-custom py-8 text-center text-sm text-secondary flex flex-col items-center">
        
        {/* Donate Button Area */}
        <div className="mb-8">
          <DonateButton />
        </div>

        <p>&copy; {new Date().getFullYear()} 梓安的思维空间. All rights reserved. (v1.0.1)</p>
        <div className="mt-4 flex justify-center gap-6">
          <a href="/rss.xml" className="hover:text-primary transition-colors">RSS订阅</a>
        </div>
        <p className="mt-4">
          Built with <span className="font-semibold text-primary">Next.js</span> & <span className="font-semibold text-primary">Tailwind CSS</span>
        </p>
      </div>
    </footer>
  );
}
