let loginAttempts = 0;

function showStatus(msg, isError = true) {
    const el = document.getElementById('statusMsg');
    el.textContent = msg;
    el.style.color = isError ? '#f87171' : '#4ade80';
}

document.getElementById('loginBtn').addEventListener('click', async function() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email === '' || password === '') {
        showStatus('Please fill in all fields!');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('student', JSON.stringify(data.student));
            showStatus('Login successful! Redirecting...', false);
            setTimeout(() => window.location.href = 'mainmenu.html', 800);
        } else {
            loginAttempts++;
            if (loginAttempts >= 4) {
                showStatus('Too many failed attempts! Redirecting...');
                setTimeout(() => window.location.href = 'index.html', 1500);
            } else {
                showStatus(`${data.message} — ${4 - loginAttempts} attempt(s) remaining.`);
            }
        }

    } catch (error) {
        showStatus('Server error! Make sure the backend is running.');
    }
});
