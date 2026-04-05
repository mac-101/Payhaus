import { Calendar } from 'lucide-react';
import { useState } from 'react';
import Btn from "./addPropertyBtn"
import AddProperty from "./addProperty"

export default function Header() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    
    const date = new Date();
    const formattedDate = date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    return (
        <>
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="font-bold text-3xl text-gray-900">Welcome back, James</h1>
                    <p className="font-medium text-gray-600 mt-1">Real-time information and activities of your property</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white">
                        <Calendar size={18} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">{formattedDate}</span>
                    </div>
                    <Btn onClick={() => setIsModalOpen(true)} />
                </div>
            </div>
            <AddProperty isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    )
}