import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import StudentPage from './pages/StudentPage';
import StudentTodoPage from './pages/StudentTodoPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AllTodosByDatePage from './pages/AllTodosByDatePage'; // 추가
import { useEffect, useState } from 'react';
import { auth } from './utils/firebaseClient';

function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      setChecking(false);
    });
    return () => unsubscribe();
  }, []);

  if (checking) return <div>로딩 중...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {user ? (
          <>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/students" element={<StudentPage />} />
            <Route path="/student/:id" element={<StudentTodoPage />} />
            <Route path="/all-todos" element={<AllTodosByDatePage />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
