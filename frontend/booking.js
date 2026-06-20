async function loadCounsellors() {
    const select = document.getElementById('counsellorName');
    try {
        const res = await fetch(`${API_BASE}/api/counsellor-auth/list`);
        const data = await res.json();
        const counsellors = data.counsellors || [];
        select.innerHTML = '<option value="">— No preference —</option>' +
            counsellors.map(c => `<option value="${c.fullname}">${c.fullname}</option>`).join('');
    } catch {
        select.innerHTML = '<option value="">— No preference —</option>';
    }
}

function requireAuth() {
    const token = localStorage.getItem('token');
    const student = JSON.parse(localStorage.getItem('student') || 'null');
    if (!token || !student) {
        window.location.href = 'loginpage.html';
        return null;
    }
    return { token, student };
}

function renderBookings(bookings) {
    const container = document.getElementById('bookingList');
    if (!bookings || bookings.length === 0) {
        container.innerHTML = `<div class="bg-gray-700 border border-gray-600 rounded-lg p-4 text-gray-300">
            No bookings yet.
        </div>`;
        return;
    }

    container.innerHTML = bookings
        .map((b) => {
            const date = b.session_date ? String(b.session_date).slice(0, 10) : '';
            const time = b.session_time ? String(b.session_time).slice(0, 5) : '';
            const counsellor = b.counsellor_name || 'Counsellor (not specified)';
            const notes = b.notes ? `<p class="text-gray-300 mt-2">${b.notes}</p>` : '';
            return `<div class="bg-gray-700 border border-red-500 rounded-lg p-4">
                <p class="text-white font-bold">${counsellor}</p>
                <p class="text-gray-300">${date} • ${time} • ${b.mode}</p>
                ${notes}
            </div>`;
        })
        .join('');
}

async function loadBookings() {
    const auth = requireAuth();
    if (!auth) return;

    try {
        const res = await fetch(`${API_BASE}/api/bookings`, {
            headers: { Authorization: `Bearer ${auth.token}` }
        });
        const data = await res.json();
        if (res.ok) {
            renderBookings(data.bookings || []);
        } else {
            renderBookings([]);
        }
    } catch (e) {
        renderBookings([]);
    }
}

document.getElementById('bookingForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const auth = requireAuth();
    if (!auth) return;

    const status = document.getElementById('statusMsg');
    status.textContent = 'Submitting...';

    const payload = {
        counsellor_name: document.getElementById('counsellorName').value.trim() || undefined,
        session_date: document.getElementById('sessionDate').value,
        session_time: document.getElementById('sessionTime').value,
        mode: document.getElementById('mode').value,
        notes: document.getElementById('notes').value.trim() || undefined
    };

    try {
        const res = await fetch(`${API_BASE}/api/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth.token}`
            },
            body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (!res.ok) {
            status.textContent = data?.message || 'Could not create booking';
            return;
        }

        status.textContent = 'Booking saved.';
        document.getElementById('notes').value = '';
        await loadBookings();
    } catch (err) {
        status.textContent = 'Network error. Make sure the backend is running.';
    }
});

loadCounsellors();
loadBookings();

