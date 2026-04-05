import { Search, HomeIcon, Building2Icon, Users2, PaintRoller, LogOut, Settings } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"

export default function SideBar() {
    const navigate = useNavigate()
    const location = useLocation()

    const NAVIGATION = [
        { id: "dashboard", label: "Overview", Icon: HomeIcon, path: "/" },
        { id: "property", label: "Property", Icon: Building2Icon, path: "/property" },
        { id: "people", label: "People", Icon: Users2, path: "/people" },
        { id: "maintenance", label: "Maintenance", Icon: PaintRoller, path: "/maintenance" },
    ]

    const getActive = () => {
        if (location.pathname === "/") return "dashboard"
        if (location.pathname === "/property") return "property"
        if (location.pathname === "/people") return "people"
        if (location.pathname === "/maintenance") return "maintenance"
        return "dashboard"
    }

    const [active, setIsActive] = useState(getActive())

    return (
        <div className="sticky top-0 h-dvh bg-white border-r border-gray-200">
            <div className="flex flex-col w-60 h-full p-6">
                
                {/* Logo */}
                <div className="pb-6 border-b border-gray-200 mb-6">
                    <h1 className="text-2xl font-bold">
                        <span className="text-blue-600">Pay</span>
                        <span className="text-gray-900">haus</span>
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">Property Management</p>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            className="w-full pl-9 pr-3 py-2 border border-gray-300 bg-white text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                        />
                    </div>
                </div>

                {/* Navigation Menu */}
                <div className="flex-1">
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">Menu</h2>
                    <nav className="space-y-1">
                        {NAVIGATION.map(section => (
                            <button
                                key={section.id}
                                onClick={() => {
                                    setIsActive(section.id)
                                    navigate(section.path)
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all border border-transparent ${
                                    active === section.id
                                        ? "bg-blue-50 border-blue-300 text-blue-700"
                                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                            >
                                <section.Icon 
                                    size={18} 
                                    strokeWidth={active === section.id ? 2.5 : 2}
                                    className={active === section.id ? "text-blue-600" : "text-gray-400"}
                                />
                                <span>{section.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-200 pt-4 space-y-1">
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        <Settings size={18} className="text-gray-400" />
                        <span>Settings</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors">
                        <LogOut size={18} className="text-gray-400" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    )
}