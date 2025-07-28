// components/database/QueryExamples.js
import { Search, TrendingUp, Users, ShoppingCart, Calendar, Database } from 'lucide-react';

const QUERY_CATEGORIES = [
  {
    id: 'basic',
    name: 'Basic Queries',
    icon: Database,
    color: 'purple',
    queries: [
      { text: "How many records are in each table?", category: "overview" },
      { text: "Show me the structure of the users table", category: "schema" },
      { text: "What are all the table names in this database?", category: "schema" },
      { text: "List the columns in the orders table", category: "schema" }
    ]
  },
  {
    id: 'analytics',
    name: 'Analytics',
    icon: TrendingUp,
    color: 'blue',
    queries: [
      { text: "What are the top 10 best-selling products?", category: "sales" },
      { text: "Show me sales trends for the last 6 months", category: "trends" },
      { text: "Which customers have the highest order values?", category: "customers" },
      { text: "What is the average order value by month?", category: "sales" }
    ]
  },
  {
    id: 'users',
    name: 'User Management',
    icon: Users,
    color: 'green',
    queries: [
      { text: "How many active users do we have?", category: "users" },
      { text: "Show me users who registered last month", category: "users" },
      { text: "Which users haven't logged in for 30 days?", category: "users" },
      { text: "What are the most common user locations?", category: "demographics" }
    ]
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    icon: ShoppingCart,
    color: 'orange',
    queries: [
      { text: "What products are running low on inventory?", category: "inventory" },
      { text: "Show me pending orders from this week", category: "orders" },
      { text: "Which products have the highest return rates?", category: "returns" },
      { text: "What is the conversion rate by traffic source?", category: "marketing" }
    ]
  },
  {
    id: 'temporal',
    name: 'Time-based Analysis',
    icon: Calendar,
    color: 'yellow',
    queries: [
      { text: "Show me activity patterns by hour of day", category: "patterns" },
      { text: "What days of the week have the highest sales?", category: "sales" },
      { text: "Compare this month's performance to last month", category: "comparison" },
      { text: "Find seasonal trends in our data", category: "trends" }
    ]
  }
];

const getColorClasses = (color) => {
  const colors = {
    purple: {
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/30',
      text: 'text-purple-300',
      icon: 'text-purple-400',
      hover: 'hover:bg-purple-500/20'
    },
    blue: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-300',
      icon: 'text-blue-400',
      hover: 'hover:bg-blue-500/20'
    },
    green: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      text: 'text-green-300',
      icon: 'text-green-400',
      hover: 'hover:bg-green-500/20'
    },
    orange: {
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/30',
      text: 'text-orange-300',
      icon: 'text-orange-400',
      hover: 'hover:bg-orange-500/20'
    },
    yellow: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      text: 'text-yellow-300',
      icon: 'text-yellow-400',
      hover: 'hover:bg-yellow-500/20'
    }
  };
  return colors[color] || colors.purple;
};

export default function QueryExamples({ connectionStatus, onQuerySelect, setActiveTab, setInputMessage }) {
  const handleQueryClick = (queryText) => {
    if (onQuerySelect) {
      onQuerySelect(queryText);
    } else if (setActiveTab && setInputMessage) {
      setActiveTab('chat');
      setInputMessage(queryText);
    }
  };

  if (connectionStatus !== 'connected') {
    return (
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Natural Language Queries</h3>
        <div className="bg-white/5 rounded-lg p-8 text-center">
          <Search className="w-12 h-12 mx-auto text-purple-400 mb-4" />
          <p className="text-purple-300 mb-2">Connect to database first</p>
          <p className="text-purple-400 text-sm">
            Once connected, you will see example queries you can ask about your data
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Natural Language Queries</h3>
        <div className="text-sm text-purple-300">
          Click any query to try it out
        </div>
      </div>

      <div className="space-y-6">
        {QUERY_CATEGORIES.map((category) => {
          const Icon = category.icon;
          const colors = getColorClasses(category.color);

          return (
            <div key={category.id} className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${colors.bg} ${colors.border} border`}>
                  <Icon className={`w-5 h-5 ${colors.icon}`} />
                </div>
                <h4 className="text-white font-medium">{category.name}</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {category.queries.map((query, index) => (
                  <button
                    key={index}
                    onClick={() => handleQueryClick(query.text)}
                    className={`text-left p-4 rounded-lg border transition-all ${colors.bg} ${colors.border} ${colors.hover} group`}
                  >
                    <div className="flex items-start space-x-3">
                      <Search className={`w-4 h-4 mt-1 ${colors.icon} opacity-70 group-hover:opacity-100 transition-opacity`} />
                      <div className="flex-1">
                        <p className={`text-sm ${colors.text} group-hover:text-white transition-colors`}>
                          {query.text}
                        </p>
                        <span className={`text-xs ${colors.icon} opacity-60 mt-1 block`}>
                          {query.category}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Query Input */}
      <div className="mt-8 p-4 bg-white/5 rounded-lg border border-purple-500/20">
        <h4 className="text-white font-medium mb-3 flex items-center">
          <Search className="w-4 h-4 mr-2" />
          Custom Query
        </h4>
        <div className="flex space-x-3">
          <input
            type="text"
            placeholder="Ask anything about your database..."
            className="flex-1 bg-white/10 text-white placeholder-purple-400 border border-purple-500/30 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                handleQueryClick(e.target.value.trim());
                e.target.value = '';
              }
            }}
          />
          <button
            onClick={(e) => {
              const input = e.target.previousElementSibling;
              if (input.value.trim()) {
                handleQueryClick(input.value.trim());
                input.value = '';
              }
            }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
          >
            Ask
          </button>
        </div>
        <p className="text-xs text-purple-400 mt-2">
          💡 Try asking about table relationships, data patterns, or specific business questions
        </p>
      </div>

      {/* Query Tips */}
      <div className="mt-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-4">
        <h4 className="text-white font-medium mb-2">💡 Query Tips</h4>
        <div className="text-sm text-purple-300 space-y-1">
          <p>• Ask specific questions about your data relationships</p>
          <p>• Use natural language - no need for SQL syntax</p>
          <p>• Try comparative questions like compare X to Y</p>
          <p>• Ask for trends, patterns, and insights</p>
          <p>• Request data in different formats (charts, lists, summaries)</p>
        </div>
      </div>
    </div>
  );
}