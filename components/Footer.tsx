export default function Footer() {
  return (
    <footer className="border-t border-border bg-accent/50 mt-12">
      <div className="container-custom py-8 text-center text-sm text-secondary">
        <p>&copy; {new Date().getFullYear()} 梓安的思维空间. All rights reserved.</p>
        <p className="mt-2">
          Built with <span className="font-semibold text-primary">Next.js</span> & <span className="font-semibold text-primary">Tailwind CSS</span>
        </p>
      </div>
    </footer>
  );
}
