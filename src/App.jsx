// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StudentPage from './pages/StudentPage';
import StudentTodoPage from './pages/StudentTodoPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StudentPage />} />
        <Route path="/student/:id" element={<StudentTodoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
