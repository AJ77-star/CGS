function requireAdmin() {
    const token = localStorage.getItem('adminToken');
    const admin = JSON.parse(localStorage.getItem('admin') || 'null');
    if (!token || !admin) {
        window.location.href = 'adminlogin.html';
        return null;
    }
    return { token, admin };
}

function authHeaders(token) {
    return { Authorization: `Bearer ${token}` };
}

function setActiveTab(tab) {
    document.querySelectorAll('.tab-btn').forEach((btn) => {
        const isActive = btn.dataset.tab === tab;
        btn.classList.toggle('bg-blue-500', isActive);
        btn.classList.toggle('text-white', isActive);
        btn.classList.toggle('bg-gray-700', !isActive);
    });

    document.getElementById('panelStudents').classList.toggle('hidden', tab !== 'students');
    document.getElementById('panelBookings').classList.toggle('hidden', tab !== 'bookings');
    document.getElementById('panelQuiz').classList.toggle('hidden', tab !== 'quiz');
}

function renderStudents(students) {
    const tbody = document.getElementById('studentsTable');
    if (!students.length) {
        tbody.innerHTML = '<tr><td colspan="5" class="py-4 text-gray-400">No students registered yet.</td></tr>';
        return;
    }

    tbody.innerHTML = students
        .map(
            (s) => `<tr class="border-b border-gray-700">
                <td class="py-3 pr-4">${s.id}</td>
                <td class="py-3 pr-4">${s.fullname}</td>
                <td class="py-3 pr-4">${s.email}</td>
                <td class="py-3 pr-4">${s.quiz_count}</td>
                <td class="py-3">${s.booking_count}</td>
            </tr>`
        )
        .join('');
}

function renderBookings(bookings) {
    const tbody = document.getElementById('bookingsTable');
    if (!bookings.length) {
        tbody.innerHTML = '<tr><td colspan="6" class="py-4 text-gray-400">No bookings yet.</td></tr>';
        return;
    }

    tbody.innerHTML = bookings
        .map((b) => {
            const date = b.session_date ? String(b.session_date).slice(0, 10) : '';
            const time = b.session_time ? String(b.session_time).slice(0, 5) : '';
            return `<tr class="border-b border-gray-700">
                <td class="py-3 pr-4">${b.student_name}<br><span class="text-gray-400 text-xs">${b.student_email}</span></td>
                <td class="py-3 pr-4">${b.counsellor_name || '—'}</td>
                <td class="py-3 pr-4">${date}</td>
                <td class="py-3 pr-4">${time}</td>
                <td class="py-3 pr-4">${b.mode}</td>
                <td class="py-3">${b.notes || '—'}</td>
            </tr>`;
        })
        .join('');
}

function renderQuizResults(results) {
    const tbody = document.getElementById('quizTable');
    if (!results.length) {
        tbody.innerHTML = '<tr><td colspan="5" class="py-4 text-gray-400">No quiz results yet.</td></tr>';
        return;
    }

    tbody.innerHTML = results
        .map((q) => {
            const subjects = Array.isArray(q.subjects) ? q.subjects.join(', ') : '';
            return `<tr class="border-b border-gray-700">
                <td class="py-3 pr-4">${q.student_name}<br><span class="text-gray-400 text-xs">${q.student_email}</span></td>
                <td class="py-3 pr-4">${q.track || '—'}</td>
                <td class="py-3 pr-4">${subjects || '—'}</td>
                <td class="py-3 pr-4">${q.iq_score ?? '—'}/5</td>
                <td class="py-3">${q.recommendation || '—'}</td>
            </tr>`;
        })
        .join('');
}

async function loadDashboard() {
    const auth = requireAdmin();
    if (!auth) return;

    document.getElementById('adminName').textContent = auth.admin.fullname || auth.admin.email;
    const status = document.getElementById('statusMsg');
    status.textContent = 'Loading dashboard...';

    try {
        const headers = authHeaders(auth.token);
        const [overviewRes, studentsRes, bookingsRes, quizRes] = await Promise.all([
            fetch(`${API_BASE}/api/admin/overview`, { headers }),
            fetch(`${API_BASE}/api/admin/students`, { headers }),
            fetch(`${API_BASE}/api/admin/bookings`, { headers }),
            fetch(`${API_BASE}/api/admin/quiz-results`, { headers })
        ]);

        if ([overviewRes, studentsRes, bookingsRes, quizRes].some((res) => res.status === 401 || res.status === 403)) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('admin');
            window.location.href = 'adminlogin.html';
            return;
        }

        const overview = await overviewRes.json();
        const students = await studentsRes.json();
        const bookings = await bookingsRes.json();
        const quiz = await quizRes.json();

        if (overviewRes.ok && overview.stats) {
            document.getElementById('statStudents').textContent = overview.stats.students;
            document.getElementById('statBookings').textContent = overview.stats.bookings;
            document.getElementById('statQuizResults').textContent = overview.stats.quizResults;
        }

        if (studentsRes.ok) renderStudents(students.students || []);
        if (bookingsRes.ok) renderBookings(bookings.bookings || []);
        if (quizRes.ok) renderQuizResults(quiz.quizResults || []);

        status.textContent = '';
    } catch (error) {
        status.textContent = 'Could not load dashboard. Make sure the backend is running.';
    }
}

document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => setActiveTab(btn.dataset.tab));
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    window.location.href = 'adminlogin.html';
});

loadDashboard();
