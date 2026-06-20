function requireCounsellor() {
    const token = localStorage.getItem('counsellorToken');
    const counsellor = JSON.parse(localStorage.getItem('counsellor') || 'null');
    if (!token || !counsellor) {
        window.location.href = 'counsellor-login.html';
        return null;
    }
    return { token, counsellor };
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

    document.getElementById('panelBookings').classList.toggle('hidden', tab !== 'bookings');
    document.getElementById('panelProgress').classList.toggle('hidden', tab !== 'progress');
}

function renderBookings(bookings) {
    const tbody = document.getElementById('bookingsTable');
    if (!bookings.length) {
        tbody.innerHTML = '<tr><td colspan="5" class="py-4 text-gray-400">No bookings yet.</td></tr>';
        return;
    }

    tbody.innerHTML = bookings
        .map((b) => {
            const date = b.session_date ? String(b.session_date).slice(0, 10) : '';
            const time = b.session_time ? String(b.session_time).slice(0, 5) : '';
            return `<tr class="border-b border-gray-700">
                <td class="py-3 pr-4">${b.student_name}<br><span class="text-gray-400 text-xs">${b.student_email}</span></td>
                <td class="py-3 pr-4">${date}</td>
                <td class="py-3 pr-4">${time}</td>
                <td class="py-3 pr-4">${b.mode}</td>
                <td class="py-3">${b.notes || '—'}</td>
            </tr>`;
        })
        .join('');
}

function renderProgress(results) {
    const tbody = document.getElementById('progressTable');
    if (!results.length) {
        tbody.innerHTML = '<tr><td colspan="5" class="py-4 text-gray-400">No student progress yet.</td></tr>';
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
    const auth = requireCounsellor();
    if (!auth) return;

    document.getElementById('counsellorName').textContent = auth.counsellor.fullname || auth.counsellor.email;
    const status = document.getElementById('statusMsg');
    status.textContent = 'Loading dashboard...';

    try {
        const headers = authHeaders(auth.token);
        const [bookingsRes, progressRes] = await Promise.all([
            fetch(`${API_BASE}/api/counsellor/bookings`, { headers }),
            fetch(`${API_BASE}/api/counsellor/progress`, { headers })
        ]);

        if ([bookingsRes, progressRes].some((res) => res.status === 401 || res.status === 403)) {
            localStorage.removeItem('counsellorToken');
            localStorage.removeItem('counsellor');
            window.location.href = 'counsellor-login.html';
            return;
        }

        const bookings = await bookingsRes.json();
        const progress = await progressRes.json();

        if (bookingsRes.ok) {
            renderBookings(bookings.bookings || []);
            document.getElementById('statBookings').textContent = (bookings.bookings || []).length;
        }

        if (progressRes.ok) {
            renderProgress(progress.quizResults || []);
            const uniqueStudents = new Set((progress.quizResults || []).map(q => q.student_email));
            document.getElementById('statStudents').textContent = uniqueStudents.size;
        }

        status.textContent = '';
    } catch (error) {
        status.textContent = 'Could not load dashboard. Make sure the backend is running.';
    }
}

document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => setActiveTab(btn.dataset.tab));
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('counsellorToken');
    localStorage.removeItem('counsellor');
    window.location.href = 'counsellor-login.html';
});

loadDashboard();