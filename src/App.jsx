import './App.css'
import GanttChart from "./component/GanttChart.jsx";
import Toolbar from "./component/Toolbar.jsx";
import { DataProvider} from "./context/DataContext.jsx";

const App = () => {

    return (
        <DataProvider>
            <div className="App h-screen flex">
                <Toolbar/>

                <main className="w-full md:w-4/5 p-8 flex items-center justify-center">
                    <GanttChart/>
                </main>
            </div>
        </DataProvider>
    )
}
export default App
