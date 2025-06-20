import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 40 }}>
      <h2>대시보드</h2>
      <div style={{ display: 'flex', gap: 20, marginTop: 30 }}>
        <button onClick={() => navigate('/students')} style={{ padding: '10px 20px' }}>
          📋 학생 관리
        </button>
        <button onClick={() => navigate('/all-todos')} style={{ padding: '10px 20px' }}>
          📅 날짜별 할일 보기
        </button>
      </div>
    </div>
  );
}

export default DashboardPage;
