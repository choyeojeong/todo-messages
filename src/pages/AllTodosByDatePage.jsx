import { useEffect, useState } from 'react';
import { db } from '../utils/firebaseClient';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

function AllTodosByDatePage() {
  const [selectedDate, setSelectedDate] = useState('');
  const [todoList, setTodoList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [teacherOptions, setTeacherOptions] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const navigate = useNavigate();

  const fetchTodosByDate = async () => {
    if (!selectedDate) return;
    setLoading(true);
    const snapshot = await getDocs(collection(db, 'todos'));
    const filtered = snapshot.docs.filter(doc =>
      doc.id.endsWith(`_${selectedDate}`)
    );

    const result = [];
    const teachers = new Set();

    for (const docSnap of filtered) {
      const data = docSnap.data();
      const studentSnap = await getDoc(doc(db, 'students', data.studentId));
      const student = studentSnap.exists() ? studentSnap.data() : { name: '이름없음', teacher: '' };

      teachers.add(student.teacher || '');
      result.push({
        studentId: data.studentId,
        docId: docSnap.id,
        studentName: student.name,
        teacher: student.teacher,
        tasks: data.tasks || [],
        memo: data.memo || '',
      });
    }

    setTodoList(result);
    setTeacherOptions(Array.from(teachers));
    setLoading(false);
  };

  const handleToggleCheck = async (entryIndex, taskIndex) => {
    const copy = [...todoList];
    const entry = copy[entryIndex];
    const task = entry.tasks[taskIndex];
    task.done = !task.done;
    setTodoList(copy);

    try {
      await updateDoc(doc(db, 'todos', entry.docId), {
        tasks: entry.tasks,
      });
    } catch (err) {
      alert('Firestore 저장 실패: ' + err.message);
    }
  };

  const handleMemoChange = async (entryIndex, value) => {
    const copy = [...todoList];
    const entry = copy[entryIndex];
    entry.memo = value;
    setTodoList(copy);

    try {
      await updateDoc(doc(db, 'todos', entry.docId), {
        memo: value,
      });
    } catch (err) {
      alert('메모 저장 실패: ' + err.message);
    }
  };

  // 필터된 목록
  const filteredList = selectedTeacher
    ? todoList.filter(entry => entry.teacher === selectedTeacher)
    : todoList;

  return (
    <div style={{ padding: 30 }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 20 }}>
        ⬅ 뒤로가기
      </button>

      <h2>날짜별 할일 목록</h2>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <label>날짜 선택: </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <button onClick={fetchTodosByDate}>조회</button>

        {teacherOptions.length > 0 && (
          <>
            <label>담당 선생님:</label>
            <select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
            >
              <option value="">전체</option>
              {teacherOptions.map((t, idx) => (
                <option key={idx} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </>
        )}
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
          {filteredList.map((entry, entryIndex) => (
            <div
              key={entryIndex}
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
                    onChange={() => handleToggleCheck(entryIndex, i)}
                    style={{ marginLeft: 5 }}
                  />
                </div>
              ))}
              <div style={{ marginTop: 10 }}>
                <textarea
                  rows={3}
                  value={entry.memo}
                  onChange={(e) => handleMemoChange(entryIndex, e.target.value)}
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
