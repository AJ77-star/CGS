function showStatus(msg, isError = true) {
    const el = document.getElementById('statusMsg');
    el.textContent = msg;
    el.style.color = isError ? '#f87171' : '#4ade80';
}

document.getElementById('registerBtn').addEventListener('click', async function() {
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (fullname === '' || email === '' || password === '' || confirmPassword === '') {
        showStatus('Please fill in all fields!');
        return;
    }

    if (password !== confirmPassword) {
        showStatus('Passwords do not match!');
        return;
    }

    if (password.length < 6) {
        showStatus('Password must be at least 6 characters!');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullname, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            showStatus('Registration successful! Redirecting to login...', false);
            setTimeout(() => window.location.href = 'loginpage.html', 1000);
        } else {
            showStatus(data.message);
        }

    } catch (error) {
        showStatus('Server error! Make sure the backend is running.');
    }
});
