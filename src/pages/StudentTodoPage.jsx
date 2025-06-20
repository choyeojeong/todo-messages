// src/pages/StudentTodoPage.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  collection,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import { db } from '../utils/firebaseClient';
import dayjs from 'dayjs';

function StudentTodoPage() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dates, setDates] = useState([]);
  const [todos, setTodos] = useState({});
  const [message, setMessage] = useState('');
  const [savingDate, setSavingDate] = useState(''); // 저장 중 날짜
  const [copyMessage, setCopyMessage] = useState(false); // 메시지 복사 알림

  useEffect(() => {
    const fetchStudent = async () => {
      const snap = await getDoc(doc(db, 'students', id));
      if (snap.exists()) setStudent(snap.data());
    };
    fetchStudent();
  }, [id]);

  const generateDates = () => {
    const result = [];
    let current = dayjs(startDate);
    const end = dayjs(endDate);
    while (current.isBefore(end) || current.isSame(end)) {
      result.push(current.format('YYYY-MM-DD'));
      current = current.add(1, 'day');
    }
    setDates(result);
  };

  const handleAddTask = (date) => {
    const prev = todos[date] || { tasks: [], memo: '' };
    const updated = {
      ...prev,
      tasks: [...prev.tasks, { text: '', done: false }],
    };
    setTodos({ ...todos, [date]: updated });
  };

  const handleTaskChange = (date, index, field, value) => {
    const copy = { ...todos };
    copy[date].tasks[index][field] = value;
    setTodos(copy);
  };

  const handleRemoveTask = (date, index) => {
    const copy = { ...todos };
    copy[date].tasks.splice(index, 1);
    setTodos(copy);
  };

  const handleMemoChange = (date, value) => {
    const copy = { ...todos };
    copy[date].memo = value;
    setTodos(copy);
  };

  const handleSave = async (date) => {
    setSavingDate(date);
    const ref = doc(db, 'todos', `${id}_${date}`);
    await setDoc(ref, {
      studentId: id,
      date,
      tasks: todos[date]?.tasks || [],
      memo: todos[date]?.memo || '',
    });
    setSavingDate('');
    alert(`${date} 저장 완료`);
  };

  const handleGenerateMessage = () => {
    let text = `[${student?.name} 다음주차 할 일]\n\n`;

    dates.forEach((date) => {
      const d = dayjs(date);
      const weekday = ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'][d.day()];
      const items = todos[date]?.tasks || [];
      if (items.length > 0) {
        text += `${weekday} (${d.format('M/D')})\n`;
        items.forEach(t => text += `- ${t.text}\n`);
        text += '\n';
      }
    });

    text += `[강의목록]\n\n[단어시험]\n60문제, -3컷`;

    setMessage(text);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopyMessage(true);
      setTimeout(() => setCopyMessage(false), 2000);
    } catch (err) {
      alert('클립보드 복사 실패');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>{student?.name} 할 일 관리</h2>

      <div style={{ marginBottom: 20 }}>
        <label>시작일: </label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <label style={{ marginLeft: 20 }}>종료일: </label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        <button onClick={generateDates} style={{ marginLeft: 20 }}>날짜 생성</button>
      </div>

      <div style={{ display: 'flex', gap: 20, overflowX: 'auto' }}>
        {dates.map((date) => {
          const d = dayjs(date);
          const weekday = ['일','월','화','수','목','금','토'][d.day()];
          const todo = todos[date] || { tasks: [], memo: '' };

          return (
            <div key={date} style={{
              minWidth: 250,
              border: '1px solid #ccc',
              padding: 10,
              backgroundColor: '#f9f9f9'
            }}>
              <strong>{weekday} ({d.format('M/D')})</strong>
              <hr />
              {todo.tasks.map((task, index) => (
                <div key={index} style={{ marginBottom: 5 }}>
                  <input
                    value={task.text}
                    onChange={(e) => handleTaskChange(date, index, 'text', e.target.value)}
                    style={{ width: '70%' }}
                  />
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={(e) => handleTaskChange(date, index, 'done', e.target.checked)}
                    style={{ marginLeft: 5 }}
                  />
                  <button onClick={() => handleRemoveTask(date, index)}>❌</button>
                </div>
              ))}
              <button onClick={() => handleAddTask(date)}>+ 할일 추가</button>
              <div style={{ marginTop: 10 }}>
                <textarea
                  rows={3}
                  placeholder="메모"
                  value={todo.memo}
                  onChange={(e) => handleMemoChange(date, e.target.value)}
                  style={{ width: '100%', backgroundColor: '#eef' }}
                />
              </div>
              <button
                onClick={() => handleSave(date)}
                disabled={savingDate === date}
              >
                {savingDate === date ? '저장 중...' : '저장'}
              </button>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 40 }}>
        <button onClick={handleGenerateMessage}>메시지 생성</button>
        <button onClick={handleCopy} style={{ marginLeft: 10 }}>
          복사하기
        </button>
        {copyMessage && <span style={{ marginLeft: 10, color: 'green' }}>복사 완료!</span>}
        <textarea
          value={message}
          rows={10}
          style={{ width: '100%', marginTop: 10 }}
          readOnly
        />
      </div>
    </div>
  );
}

export default StudentTodoPage;
