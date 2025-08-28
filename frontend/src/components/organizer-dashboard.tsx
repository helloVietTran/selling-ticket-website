import Sidebar from "./sidebar"
import TopBar from "./top-bar"



const OrganizerDashboard = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-black/90 to-gray-900 text-white flex">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <TopBar />
              

                <main className="flex-1 px-8 py-6">
                   
                </main>
            </div>
        </div>
    )
}

export default OrganizerDashboard