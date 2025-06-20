import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../utils/firebaseClient';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, pw);
      navigate('/'); // 로그인 성공하면 메인으로 이동
    } catch (err) {
      alert('로그인 실패: ' + err.message);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>로그인</h2>
      <input
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br /><br />
      <input
        type="password"
        placeholder="비밀번호"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
      /><br /><br />
      <button onClick={handleLogin}>로그인</button>
    </div>
  );
}

export default LoginPage;
