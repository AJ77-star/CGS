document.getElementById('profileBtn').addEventListener('click', function() {
    window.location.href = 'profile.html';
});

document.getElementById('startQuizBtn').addEventListener('click', function() {
    window.location.href = 'quiz.html';
});

document.getElementById('viewResultsBtn').addEventListener('click', function() {
    window.location.href = 'results.html';
});

document.getElementById('bookSessionBtn').addEventListener('click', function() {
    window.location.href = 'booking.html';
});

document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('token');
    localStorage.removeItem('student');
    window.location.href = 'index.html';
});
