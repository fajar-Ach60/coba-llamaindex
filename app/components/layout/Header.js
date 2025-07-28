import {Brain} from 'lucide-react'
import StatusIndicator from '../common/StatusIndicator'


export default function Header(){
    return (
    <header className="bg-black/20 backdrop-blur-md border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                <h1 className="text-xl font-bold text-white">LlamaIndex AI</h1>
                <p className="text-sm text-purple-300">Intelligent Document Search</p>
                </div>
            </div>
                <StatusIndicator />
            </div>
        </div>
    </header>
    );
}