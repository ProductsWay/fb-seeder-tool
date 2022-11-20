export function Welcome({ onClick }: { onClick: () => void }) {
  return (
    <div className="min-h-screen hero">
      <div className="text-center hero-content">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Hello there</h1>
          <p className="py-6">Effortless Facebook Seeding Tool</p>
          <button onClick={onClick} className="btn btn-primary">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
