import './App.css'
import VideoComponent from "./pages/VideoPage/VideoClassic.jsx";
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
import LayoutMobile from "./Layouts/LayoutMobile.jsx";
import Payment from "./pages/Payment/Payment.jsx";
function App() {

  return (
    <>
        <Router>
            <Switch>
                <LayoutMobile>
                    <Route exact path="/" component={LandingPage}/>
                    <Route path="/main" component={WorkingPage} />
                    <Route path="/video" component={VideoComponent}/>
                    <Route path="/test" component={VideoPageTest}/>
                    <Route path="/maps" component={MapsPage}/>
                    <Route path="/pay" component={Payment}/>
                </LayoutMobile>
            </Switch>
        </Router>
    </>
  )
}

export default App
