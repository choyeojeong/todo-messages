// src/pages/StudentPage.jsx
import { useState, useEffect } from 'react';
import { db } from '../utils/firebaseClient';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function StudentPage() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    name: '',
    school: '',
    grade: '',
    teacher: '',
  });
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);

  const fetchStudents = async () => {
    const snapshot = await getDocs(collection(db, 'students'));
    const result = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setStudents(result);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAddOrUpdate = async () => {
    const { name, school, grade, teacher } = form;
    if (!name || !school || !grade || !teacher) {
      alert('모든 항목을 입력하세요.');
      return;
    }

    if (editingId) {
      const ref = doc(db, 'students', editingId);
      await updateDoc(ref, form);
      setEditingId(null);
    } else {
      await addDoc(collection(db, 'students'), form);
    }

    setForm({ name: '', school: '', grade: '', teacher: '' });
    fetchStudents();
  };

  const handleEdit = (student) => {
    setForm({
      name: student.name,
      school: student.school,
      grade: student.grade,
      teacher: student.teacher,
    });
    setEditingId(student.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      await deleteDoc(doc(db, 'students', id));
      fetchStudents();
    }
  };

  const filtered = students.filter(s =>
    [s.name, s.school, s.grade, s.teacher].some(field =>
      field.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div style={{ padding: 30 }}>
      <h2>학생 {editingId ? '수정' : '등록'}</h2>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <input
          placeholder="이름"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="학교"
          value={form.school}
          onChange={e => setForm({ ...form, school: e.target.value })}
        />
        <input
          placeholder="학년"
          value={form.grade}
          onChange={e => setForm({ ...form, grade: e.target.value })}
        />
        <input
          placeholder="담당선생님"
          value={form.teacher}
          onChange={e => setForm({ ...form, teacher: e.target.value })}
        />
        <button onClick={handleAddOrUpdate}>
          {editingId ? '수정 저장' : '등록'}
        </button>
        {editingId && (
          <button onClick={() => {
            setEditingId(null);
            setForm({ name: '', school: '', grade: '', teacher: '' });
          }}>
            취소
          </button>
        )}
      </div>

      <h2>학생 목록</h2>
      <input
        placeholder="이름/학교/학년/담당T 검색"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: 10, width: 300 }}
      />
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>이름</th>
            <th>학교</th>
            <th>학년</th>
            <th>담당선생님</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(s => (
            <tr key={s.id}>
              <td
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/student/${s.id}`)}
              >
                {s.name}
              </td>
              <td>{s.school}</td>
              <td>{s.grade}</td>
              <td>{s.teacher}</td>
              <td>
                <button onClick={() => handleEdit(s)}>수정</button>
                <button onClick={() => handleDelete(s.id)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentPage;
