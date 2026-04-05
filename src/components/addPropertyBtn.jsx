import { PlusCircle } from "lucide-react"

export default function Btn({ onClick }) {
    return (
        <button 
            onClick={onClick}
            className="py-2.5 px-4 text-sm font-semibold flex items-center gap-2 text-white bg-blue-600 border border-blue-700 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
            <PlusCircle size={18} /> 
            Add Property
        </button>
    )
}