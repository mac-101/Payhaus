import SideBar from "./sideBar"

export default function AppLayout({children}) {

    return(
        <div className="bg-gray-50 flex min-h-screen">
            <SideBar/>
            <div className="flex-1 p-8">
                <div className="bg-white border border-gray-200">
                    {children}
                </div>
            </div>
        </div>
    )
}