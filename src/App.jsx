import './App.css'
import VideoComponent from "./pages/VideoPage/VideoClassic.jsx";
import './firebaseConfig.js'
import WorkingPage from "./pages/WorkingPage.jsx";
import LandingPage from "./pages/LandingPage/LandingPage.jsx";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useHistory,
} from "react-router-dom";
import VideoPageTest from "./pages/VideoPageTest/VideoPageTest.jsx";
import MapsPage from "./pages/MapsPage/MapsPage.jsx";
function App() {

  return (
    <>
        <Router>
            <Switch>
                <Route exact path="/" component={LandingPage}/>
                <Route path="/main" component={WorkingPage} />
                <Route path="/video" component={VideoComponent}/>
                <Route path="/test" component={VideoPageTest}/>
                <Route path="/maps" component={MapsPage}/>
            </Switch>
        </Router>
    </>
  )
}

export default App
