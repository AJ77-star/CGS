function requireAuth() {
    const token = localStorage.getItem('token');
    const student = JSON.parse(localStorage.getItem('student') || 'null');
    if (!token || !student) {
        window.location.href = 'loginpage.html';
        return null;
    }
    return { token, student };
}

async function loadProfile() {
    const auth = requireAuth();
    if (!auth) return;

    document.getElementById('emailDisplay').textContent = auth.student.email || '—';
    document.getElementById('fullname').value = auth.student.fullname || '';

    try {
        const res = await fetch(`${API_BASE}/api/profile`, {
            headers: { Authorization: `Bearer ${auth.token}` }
        });
        const data = await res.json();
        if (res.ok && data?.student) {
            document.getElementById('emailDisplay').textContent = data.student.email || '—';
            document.getElementById('fullname').value = data.student.fullname || '';
            localStorage.setItem('student', JSON.stringify(data.student));
        }
    } catch (e) {
        // keep local fallback
    }
}

document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const auth = requireAuth();
    if (!auth) return;

    const fullname = document.getElementById('fullname').value.trim();
    const password = document.getElementById('newPassword').value;
    const status = document.getElementById('statusMsg');
    status.textContent = 'Saving...';

    const payload = {};
    if (fullname) payload.fullname = fullname;
    if (password) payload.password = password;

    try {
        const res = await fetch(`${API_BASE}/api/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth.token}`
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (!res.ok) {
            status.textContent = data?.message || 'Could not update profile';
            return;
        }

        if (data?.student) {
            localStorage.setItem('student', JSON.stringify(data.student));
            document.getElementById('emailDisplay').textContent = data.student.email || '—';
            document.getElementById('fullname').value = data.student.fullname || '';
        }

        document.getElementById('newPassword').value = '';
        status.textContent = 'Profile updated successfully.';
    } catch (err) {
        status.textContent = 'Network error. Make sure the backend is running.';
    }
});

loadProfile();

