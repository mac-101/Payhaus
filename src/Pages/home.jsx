import Stats from "../components/stats"
import Header from "../components/header"

export default function Home() {
    return (
        <div className="p-4 flex flex-col gap-4">
            <Header/>
            <Stats/>
        </div>
    )
}