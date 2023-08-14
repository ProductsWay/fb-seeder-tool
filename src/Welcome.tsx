export function Welcome({ onClick }: { readonly onClick: () => void }) {
  return (
    <div className="min-h-screen hero">
      <div className="text-center hero-content">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Hello there</h1>
          <p className="py-6">Effortless Facebook Seeding Tool</p>
          <button type="button" className="btn btn-primary" onClick={onClick}>
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
