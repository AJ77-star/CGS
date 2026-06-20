document.getElementById('counsellorLoginBtn').addEventListener('click', async function() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const status = document.getElementById('statusMsg');

    if (!email || !password) {
        status.textContent = 'Please fill in all fields.';
        return;
    }

    status.textContent = 'Signing in...';

    try {
        const response = await fetch(`${API_BASE}/api/counsellor-auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('counsellorToken', data.token);
            localStorage.setItem('counsellor', JSON.stringify(data.counsellor));
            window.location.href = 'counsellordashboard.html';
        } else {
            status.textContent = data.message || 'Login failed.';
        }
    } catch (error) {
        status.textContent = 'Server error. Make sure the backend is running.';
        console.error('Login error:', error);
    }
});