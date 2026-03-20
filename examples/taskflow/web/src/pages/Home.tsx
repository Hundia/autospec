import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-text mb-4">
          Welcome to <span className="text-primary">TaskFlow</span>
        </h1>
        <p className="text-lg text-text-secondary mb-8">
          A simple, powerful task management app to help you stay organized and productive.
          Create tasks, set priorities, and track your progress — all in one place.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/register"
            className="btn-primary text-base px-6 py-3"
          >
            Get Started Free
          </Link>
          <Link
            to="/login"
            className="text-text-secondary hover:text-text font-medium transition-colors"
          >
            Already have an account? Log in
          </Link>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl">
        <div className="bg-surface border border-border rounded-lg p-6 text-center">
          <div className="text-3xl mb-3">✅</div>
          <h3 className="font-semibold text-text mb-2">Task Management</h3>
          <p className="text-text-secondary text-sm">
            Create, update, and organize your tasks with priorities and due dates.
          </p>
        </div>
        <div className="bg-surface border border-border rounded-lg p-6 text-center">
          <div className="text-3xl mb-3">📁</div>
          <h3 className="font-semibold text-text mb-2">Projects</h3>
          <p className="text-text-secondary text-sm">
            Group tasks into projects for better organization and focus.
          </p>
        </div>
        <div className="bg-surface border border-border rounded-lg p-6 text-center">
          <div className="text-3xl mb-3">📊</div>
          <h3 className="font-semibold text-text mb-2">Dashboard</h3>
          <p className="text-text-secondary text-sm">
            Get a clear overview of your progress and upcoming deadlines.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
