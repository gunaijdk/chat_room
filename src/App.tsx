import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SetName from './pages/SetName/SetName';
import ChatRoom from './pages/ChatRoom/ChatRoom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SetName />} />
        <Route path="/index" element={<ChatRoom />} />
      </Routes>
    </Router>
  );
}

export default App;