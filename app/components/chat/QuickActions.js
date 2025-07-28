const quickActions = [
  {
    label: "📋 Summarize documents",
    query: "What are the main topics in my documents?"
  },
  {
    label: "🔍 Search specific info",
    query: "Find information about"
  },
  {
    label: "⚖️ Compare content",
    query: "Compare different sections"
  }
];

export default function QuickActions({ setInputMessage }) {
  return (
    <div className="bg-black/20 backdrop-blur-md rounded-xl border border-purple-500/20 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
      <div className="space-y-2">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={() => setInputMessage(action.query)}
            className="w-full text-left p-3 text-purple-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-sm"
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}