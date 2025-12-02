import { Bell, User } from 'lucide-react'

export default function Topbar() {
  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200">
      <div className="flex items-center flex-1">
        <h2 className="text-lg font-semibold text-gray-900">Welcome back!</h2>
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
          <Bell className="w-5 h-5" />
        </button>
        <button className="flex items-center space-x-2 p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
          <User className="w-5 h-5" />
          <span className="text-sm font-medium">Account</span>
        </button>
      </div>
    </header>
  )
}
