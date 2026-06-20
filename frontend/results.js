const quizData = JSON.parse(localStorage.getItem('quizData'));

if (!quizData) {
    window.location.href = 'quiz.html';
}

document.getElementById('trackResult').textContent = quizData.track.charAt(0).toUpperCase() + quizData.track.slice(1);
document.getElementById('subjectsResult').textContent = quizData.subjects.join(', ');
document.getElementById('iqResult').textContent = quizData.iqScore;

if (quizData.recommendation) {
    document.getElementById('clipsResult').classList.remove('hidden');
    document.getElementById('clipsRecommendation').textContent = quizData.recommendation;
}

if (quizData.aiExplanation) {
    document.getElementById('aiResult').classList.remove('hidden');
    document.getElementById('aiExplanation').textContent = quizData.aiExplanation;
    const sourceEl = document.getElementById('aiSource');
    if (sourceEl) sourceEl.textContent = quizData.aiSource === 'groq' ? 'Powered by Groq AI' : 'Generated from your profile';
}

const recommendations = {
    science: {
        medicine: ['Medicine', 'Pharmacy', 'Nursing', 'Medical Laboratory Science'],
        engineering: ['Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering', 'Computer Engineering'],
        agriculture: ['Agriculture', 'Veterinary Medicine', 'Food Science', 'Environmental Science'],
        research: ['Biochemistry', 'Microbiology', 'Physics', 'Mathematics']
    },
    commercial: {
        accounting: ['Accounting', 'Auditing', 'Taxation', 'Financial Management'],
        marketing: ['Marketing', 'Business Administration', 'Public Relations', 'Advertising'],
        finance: ['Banking and Finance', 'Economics', 'Investment Management', 'Insurance'],
        business: ['Business Administration', 'Entrepreneurship', 'Supply Chain Management', 'Human Resources']
    },
    arts: {
        law: ['Law', 'International Relations', 'Political Science', 'Public Administration'],
        media: ['Mass Communication', 'Journalism', 'Public Relations', 'Broadcasting'],
        education: ['Education', 'English Language', 'History', 'Philosophy'],
        socialwork: ['Social Work', 'Psychology', 'Sociology', 'Guidance and Counselling']
    }
};

const trackRecs = recommendations[quizData.track];
const careerRecs = trackRecs[quizData.activity] || Object.values(trackRecs)[0];

const recsContainer = document.getElementById('recommendations');
let html = '';
careerRecs.forEach((career, index) => {
    html += `
    <div class="bg-gray-700 border border-red-500 rounded-lg p-4 mb-3">
        <p class="text-white font-bold">🎯 ${index + 1}. ${career}</p>
    </div>`;
});
recsContainer.innerHTML = html;

document.getElementById('retakeBtn').addEventListener('click', function() {
    localStorage.removeItem('quizData');
    window.location.href = 'quiz.html';
});

document.getElementById('menuBtn').addEventListener('click', function() {
    window.location.href = 'mainmenu.html';
});