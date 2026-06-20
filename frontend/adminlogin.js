document.getElementById('adminLoginBtn').addEventListener('click', async function() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const status = document.getElementById('statusMsg');

    if (!email || !password) {
        status.textContent = 'Please fill in all fields.';
        return;
    }

    status.textContent = 'Signing in...';

    try {
        const response = await fetch(`${API_BASE}/api/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('adminToken', data.token);
            localStorage.setItem('admin', JSON.stringify(data.admin));
            window.location.href = 'admin.html';
        } else {
            status.textContent = data.message || 'Login failed.';
        }
    } catch (error) {
        status.textContent = 'Server error. Make sure the backend is running.';
    }
});
