import './App.css';
import { Route, Routes } from 'react-router-dom';
import Editor from './pages/Editor/Editor';

function App() {
  return (
    <>
       <Routes>
          <Route path="/" element={<Editor />} />
       </Routes>
    </>
 );
}

export default App;
