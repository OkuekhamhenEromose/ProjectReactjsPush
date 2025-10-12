// Layout Component - Project Portfolio


const Layout = ({ onSelectProject }) => {
  const projects = [
    {
      id: 1,
      title: 'E-Commerce Filter App',
      description: 'Product filtering with cart functionality',
      color: 'from-blue-500 to-blue-600',
      icon: '🛍️',
      available: true
    },
    {
      id: 2,
      title: 'Weather Dashboard',
      description: 'Real-time weather forecast app',
      color: 'from-sky-500 to-sky-600',
      icon: '🌤️',
      available: false
    },
    {
      id: 3,
      title: 'Task Manager',
      description: 'Todo list with priority levels',
      color: 'from-purple-500 to-purple-600',
      icon: '✓',
      available: false
    },
    {
      id: 4,
      title: 'Recipe Finder',
      description: 'Search and save your recipes',
      color: 'from-orange-500 to-orange-600',
      icon: '🍳',
      available: false
    },
    {
      id: 5,
      title: 'Expense Tracker',
      description: 'Track your spending habits',
      color: 'from-green-500 to-green-600',
      icon: '💰',
      available: false
    },
    {
      id: 6,
      title: 'Music Player',
      description: 'Stream your favorite songs',
      color: 'from-pink-500 to-pink-600',
      icon: '🎵',
      available: false
    },
    {
      id: 7,
      title: 'Fitness Tracker',
      description: 'Log workouts and progress',
      color: 'from-red-500 to-red-600',
      icon: '💪',
      available: false
    },
    {
      id: 8,
      title: 'Chat Application',
      description: 'Real-time messaging platform',
      color: 'from-indigo-500 to-indigo-600',
      icon: '💬',
      available: false
    },
    {
      id: 9,
      title: 'Photo Gallery',
      description: 'Organize and share photos',
      color: 'from-yellow-500 to-yellow-600',
      icon: '📷',
      available: false
    },
    {
      id: 10,
      title: 'Blog Platform',
      description: 'Write and publish articles',
      color: 'from-teal-500 to-teal-600',
      icon: '📝',
      available: false
    },
    {
      id: 11,
      title: 'Quiz App',
      description: 'Interactive trivia games',
      color: 'from-cyan-500 to-cyan-600',
      icon: '🎯',
      available: false
    },
    {
      id: 12,
      title: 'Calendar Scheduler',
      description: 'Manage events and meetings',
      color: 'from-violet-500 to-violet-600',
      icon: '📅',
      available: false
    },
    {
      id: 13,
      title: 'Movie Database',
      description: 'Browse and rate movies',
      color: 'from-rose-500 to-rose-600',
      icon: '🎬',
      available: false
    },
    {
      id: 14,
      title: 'Note Taking App',
      description: 'Organize your thoughts',
      color: 'from-amber-500 to-amber-600',
      icon: '📓',
      available: false
    },
    {
      id: 15,
      title: 'Portfolio Website',
      description: 'Showcase your work',
      color: 'from-emerald-500 to-emerald-600',
      icon: '🎨',
      available: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 animate-pulse">
            🚀 My React Projects Portfolio
          </h1>
          <p className="text-gray-300 text-lg">
            A collection of 15 interactive web applications built with React
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <button
              key={project.id}
              onClick={() => project.available && onSelectProject(project.id)}
              disabled={!project.available}
              className={`relative group overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                project.available ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
              }`}
            >
              <div className={`bg-gradient-to-br ${project.color} p-6 h-full`}>
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="text-6xl mb-2 transform group-hover:scale-110 transition-transform">
                    {project.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {project.title}
                  </h3>
                  <p className="text-white text-sm opacity-90">
                    {project.description}
                  </p>
                  <div className="mt-4">
                    {project.available ? (
                      <span className="inline-block bg-white bg-opacity-20 text-white px-4 py-2 rounded-full text-sm font-semibold">
                        View Project →
                      </span>
                    ) : (
                      <span className="inline-block bg-black bg-opacity-30 text-white px-4 py-2 rounded-full text-sm">
                        Coming Soon
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-400">
            Built with ❤️ using React, Tailwind CSS, and modern web technologies
          </p>
        </div>
      </div>
    </div>
  );
};

export default Layout;