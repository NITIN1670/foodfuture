import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes ,
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Index from "./components";

function App() {
  return (
    <div className="container">
        {/* <video id="video-bg" autoPlay  muted loop>
        <source src="https://video-previews.elements.envatousercontent.com/6a101751-6c22-4863-b891-1735973bd9fc/watermarked_preview/watermarked_preview.mp4" type="video/mp4" />
      </video> */}
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" exact element={<Index />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
