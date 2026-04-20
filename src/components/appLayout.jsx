import SideBar from "./sideBar"

export default function AppLayout({children}) {

    return(
        <div className="bg-gray-50 flex min-h-screen">
            <SideBar/>
            <div className="flex-1 p-2">
                <div className="bg-white pb-30 md:pb-0 border border-gray-200">
                    {children}
                </div>
            </div>
        </div>
    )
}