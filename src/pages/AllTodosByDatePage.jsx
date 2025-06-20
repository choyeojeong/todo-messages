import { useEffect, useState } from 'react';
import { db } from '../utils/firebaseClient';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

function AllTodosByDatePage() {
  const [selectedDate, setSelectedDate] = useState('');
  const [todoList, setTodoList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchTodosByDate = async () => {
    if (!selectedDate) return;
    setLoading(true);
    const snapshot = await getDocs(collection(db, 'todos'));
    const filtered = snapshot.docs.filter(doc =>
      doc.id.endsWith(`_${selectedDate}`)
    );

    const result = [];

    for (const docSnap of filtered) {
      const data = docSnap.data();
      const studentSnap = await getDoc(doc(db, 'students', data.studentId));
      const student = studentSnap.exists() ? studentSnap.data() : { name: '이름없음' };
      result.push({
        studentName: student.name,
        tasks: data.tasks || [],
        memo: data.memo || '',
      });
    }

    setTodoList(result);
    setLoading(false);
  };

  return (
    <div style={{ padding: 30 }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 20 }}>
        ⬅ 뒤로가기
      </button>

      <h2>날짜별 할일 목록</h2>
      <div style={{ marginBottom: 20 }}>
        <label>날짜 선택: </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <button onClick={fetchTodosByDate} style={{ marginLeft: 10 }}>
          조회
        </button>
      </div>

      {loading ? (
        <p>불러오는 중...</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: 20,
          }}
        >
          {todoList.map((entry, index) => (
            <div
              key={index}
              style={{
                border: '1px solid #ccc',
                padding: 10,
                backgroundColor: '#f9f9f9',
              }}
            >
              <strong>{entry.studentName}</strong>
              <hr />
              {entry.tasks.map((t, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: 5,
                    backgroundColor: t.done ? '#d4f7d4' : '#eee',
                    padding: '4px 6px',
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <input
                    value={t.text}
                    readOnly
                    style={{
                      width: '90%',
                      border: 'none',
                      background: 'transparent',
                      outline: 'none',
                    }}
                  />
                  <input
                    type="checkbox"
                    checked={t.done}
                    readOnly
                    style={{ marginLeft: 5 }}
                  />
                </div>
              ))}
              <div style={{ marginTop: 10 }}>
                <textarea
                  rows={3}
                  readOnly
                  value={entry.memo}
                  style={{ width: '100%', backgroundColor: '#eef' }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AllTodosByDatePage;
