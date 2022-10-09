export function Welcome({ onClick }: { onClick: () => void }) {
  return (
    <div className="hero min-h-screen">
      <div className="hero-content text-center">
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
