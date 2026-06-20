let selectedSubjects = [];
let detectedTrack = '';

const trackQuestions = {
    science: [
        {
            question: "1. What type of science activity do you enjoy most?",
            name: "q1",
            options: [
                { value: "lab", label: "Laboratory Experiments" },
                { value: "fieldwork", label: "Fieldwork/Outdoor Research" },
                { value: "computing", label: "Computing/Technology" },
                { value: "design", label: "Design/Building Things" }
            ]
        },
        {
            question: "2. Which career area interests you most?",
            name: "q2",
            options: [
                { value: "medicine", label: "Medicine/Health" },
                { value: "engineering", label: "Engineering/Technology" },
                { value: "agriculture", label: "Agriculture/Environment" },
                { value: "research", label: "Scientific Research" }
            ]
        },
        {
            question: "3. What is your strongest skill?",
            name: "q3",
            options: [
                { value: "analytical", label: "Analytical Thinking" },
                { value: "technical", label: "Technical Skills" },
                { value: "practical", label: "Practical/Hands-on" },
                { value: "creative", label: "Creative Problem Solving" }
            ]
        }
    ],
    commercial: [
        {
            question: "1. What type of work environment do you prefer?",
            name: "q1",
            options: [
                { value: "office", label: "Office/Corporate" },
                { value: "bank", label: "Banking/Finance" },
                { value: "entrepreneurship", label: "Entrepreneurship" },
                { value: "management", label: "Management/Administration" }
            ]
        },
        {
            question: "2. Which career area interests you most?",
            name: "q2",
            options: [
                { value: "accounting", label: "Accounting/Auditing" },
                { value: "marketing", label: "Marketing/Sales" },
                { value: "finance", label: "Finance/Investment" },
                { value: "business", label: "Business Management" }
            ]
        },
        {
            question: "3. What is your strongest skill?",
            name: "q3",
            options: [
                { value: "numerical", label: "Numerical/Data Analysis" },
                { value: "communication", label: "Communication/Negotiation" },
                { value: "leadership", label: "Leadership/Management" },
                { value: "strategic", label: "Strategic Planning" }
            ]
        }
    ],
    arts: [
        {
            question: "1. What type of activity do you enjoy most?",
            name: "q1",
            options: [
                { value: "writing", label: "Writing/Storytelling" },
                { value: "debating", label: "Debating/Public Speaking" },
                { value: "teaching", label: "Teaching/Educating" },
                { value: "helping", label: "Helping/Counselling People" }
            ]
        },
        {
            question: "2. Which career area interests you most?",
            name: "q2",
            options: [
                { value: "law", label: "Law/Justice" },
                { value: "media", label: "Media/Journalism" },
                { value: "education", label: "Education/Teaching" },
                { value: "socialwork", label: "Social Work/Counselling" }
            ]
        },
        {
            question: "3. What is your strongest skill?",
            name: "q3",
            options: [
                { value: "communication", label: "Communication" },
                { value: "empathy", label: "Empathy/People Skills" },
                { value: "research", label: "Research/Critical Thinking" },
                { value: "creative", label: "Creative Writing" }
            ]
        }
    ]
};

const iqQuestions = {
    science: [
        {
            question: "1. A car travels 120km in 2 hours. What is its average speed?",
            name: "iq1",
            options: [
                { value: "a", label: "40km/h" },
                { value: "b", label: "60km/h" },
                { value: "c", label: "80km/h" },
                { value: "d", label: "100km/h" }
            ],
            answer: "b"
        },
        {
            question: "2. Which number comes next: 3, 6, 12, 24, ?",
            name: "iq2",
            options: [
                { value: "a", label: "36" },
                { value: "b", label: "42" },
                { value: "c", label: "48" },
                { value: "d", label: "54" }
            ],
            answer: "c"
        },
        {
            question: "3. What is the chemical symbol for water?",
            name: "iq3",
            options: [
                { value: "a", label: "HO" },
                { value: "b", label: "H2O" },
                { value: "c", label: "CO2" },
                { value: "d", label: "O2" }
            ],
            answer: "b"
        },
        {
            question: "4. Which of these is NOT a living organism?",
            name: "iq4",
            options: [
                { value: "a", label: "Bacteria" },
                { value: "b", label: "Fungi" },
                { value: "c", label: "Rock" },
                { value: "d", label: "Plant" }
            ],
            answer: "c"
        },
        {
            question: "5. If a rectangle has a length of 8cm and width of 5cm, what is its area?",
            name: "iq5",
            options: [
                { value: "a", label: "30cm²" },
                { value: "b", label: "35cm²" },
                { value: "c", label: "40cm²" },
                { value: "d", label: "45cm²" }
            ],
            answer: "c"
        }
    ],
    commercial: [
        {
            question: "1. A trader buys goods for ₦5,000 and sells for ₦6,500. What is the profit?",
            name: "iq1",
            options: [
                { value: "a", label: "₦1,000" },
                { value: "b", label: "₦1,500" },
                { value: "c", label: "₦2,000" },
                { value: "d", label: "₦2,500" }
            ],
            answer: "b"
        },
        {
            question: "2. If a 10% discount is given on a ₦20,000 item, what is the selling price?",
            name: "iq2",
            options: [
                { value: "a", label: "₦16,000" },
                { value: "b", label: "₦17,000" },
                { value: "c", label: "₦18,000" },
                { value: "d", label: "₦19,000" }
            ],
            answer: "c"
        },
        {
            question: "3. Which of these best describes an asset?",
            name: "iq3",
            options: [
                { value: "a", label: "Money owed to others" },
                { value: "b", label: "Something of value owned by a business" },
                { value: "c", label: "Monthly business expenses" },
                { value: "d", label: "Tax paid to government" }
            ],
            answer: "b"
        },
        {
            question: "4. A company made a profit of ₦200,000 and shared 40% as dividend. How much was shared?",
            name: "iq4",
            options: [
                { value: "a", label: "₦60,000" },
                { value: "b", label: "₦70,000" },
                { value: "c", label: "₦80,000" },
                { value: "d", label: "₦90,000" }
            ],
            answer: "c"
        },
        {
            question: "5. Which of these is an example of a liability?",
            name: "iq5",
            options: [
                { value: "a", label: "Cash in hand" },
                { value: "b", label: "Bank loan" },
                { value: "c", label: "Office equipment" },
                { value: "d", label: "Stock of goods" }
            ],
            answer: "b"
        }
    ],
    arts: [
        {
            question: "1. Which word is closest in meaning to 'Benevolent'?",
            name: "iq1",
            options: [
                { value: "a", label: "Cruel" },
                { value: "b", label: "Kind" },
                { value: "c", label: "Lazy" },
                { value: "d", label: "Angry" }
            ],
            answer: "b"
        },
        {
            question: "2. Which of these is an example of a pronoun?",
            name: "iq2",
            options: [
                { value: "a", label: "Run" },
                { value: "b", label: "Beautiful" },
                { value: "c", label: "He" },
                { value: "d", label: "Quickly" }
            ],
            answer: "c"
        },
        {
            question: "3. What is the opposite of 'Ancient'?",
            name: "iq3",
            options: [
                { value: "a", label: "Old" },
                { value: "b", label: "Modern" },
                { value: "c", label: "Weak" },
                { value: "d", label: "Slow" }
            ],
            answer: "b"
        },
        {
            question: "4. Which of these best describes a democracy?",
            name: "iq4",
            options: [
                { value: "a", label: "Government by one person" },
                { value: "b", label: "Government by the military" },
                { value: "c", label: "Government by the people" },
                { value: "d", label: "Government by religion" }
            ],
            answer: "c"
        },
        {
            question: "5. Which sentence is grammatically correct?",
            name: "iq5",
            options: [
                { value: "a", label: "He go to school everyday" },
                { value: "b", label: "She don't like mangoes" },
                { value: "c", label: "They plays football on Sundays" },
                { value: "d", label: "He goes to school everyday" }
            ],
            answer: "d"
        }
    ]
};

function loadQuestions(containerId, questions) {
    const container = document.getElementById(containerId);
    let html = '';
    questions.forEach(q => {
        html += `<div class="text-left mb-6">
            <p class="text-white mb-4 font-bold">${q.question}</p>
            <div class="flex flex-col gap-2">`;
        q.options.forEach(opt => {
            html += `<label class="text-gray-400">
                <input type="radio" name="${q.name}" value="${opt.value}" class="mr-2"> ${opt.label}
            </label>`;
        });
        html += `</div></div>`;
    });
    container.innerHTML = html;
}

    function showModal(message) {
    document.getElementById('modalMessage').textContent = message;
    document.getElementById('modal').classList.remove('hidden');
}

document.getElementById('modalCloseBtn').addEventListener('click', function() {
    document.getElementById('modal').classList.add('hidden');
});

const subjectBtns = document.querySelectorAll('.subject-btn');
subjectBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const subject = this.dataset.subject;
        const track = this.dataset.track;

        if (this.classList.contains('bg-blue-500')) {
            this.classList.remove('bg-blue-500');
            this.classList.add('bg-gray-700');
            selectedSubjects = selectedSubjects.filter(s => s !== subject);

            const nonGeneralSubjects = selectedSubjects.filter(s => {
                const btn = document.querySelector(`[data-subject="${s}"]`);
                return btn && btn.dataset.track !== 'general';
            });
            detectedTrack = nonGeneralSubjects.length > 0
                ? document.querySelector(`[data-subject="${nonGeneralSubjects[0]}"]`).dataset.track
                : '';

        } else {
            if (track !== 'general' && detectedTrack && detectedTrack !== 'general' && track !== detectedTrack) {
                showModal('Please select subjects from the same track only!');
                return;
            }

            if (selectedSubjects.length < 3) {
                this.classList.remove('bg-gray-700');
                this.classList.add('bg-blue-500');
                selectedSubjects.push(subject);

                if (track !== 'general' && (!detectedTrack || detectedTrack === 'general')) {
                    detectedTrack = track;
                }
            } else {
                showModal('You can only select 3 subjects!');
            }
        }

        document.getElementById('subjectCount').textContent = `${selectedSubjects.length} of 3 selected`;
    });
});

document.getElementById('stage1Btn').addEventListener('click', function() {
    if (selectedSubjects.length < 3) {
        showModal('Please select exactly 3 subjects!');
        return;
    }
    
    loadQuestions('careerQuestions', trackQuestions[detectedTrack]);
    loadQuestions('iqQuestions', iqQuestions[detectedTrack]);

    document.getElementById('stage1').classList.add('hidden');
    document.getElementById('stage2').classList.remove('hidden');
});

document.getElementById('stage2Btn').addEventListener('click', function() {
    const q1 = document.querySelector('input[name="q1"]:checked');
    const q2 = document.querySelector('input[name="q2"]:checked');
    const q3 = document.querySelector('input[name="q3"]:checked');

    if (!q1 || !q2 || !q3) {
        showModal('Please answer all questions!');
        return;
    }

    document.getElementById('stage2').classList.add('hidden');
    document.getElementById('stage3').classList.remove('hidden');
});


document.getElementById('stage3Btn').addEventListener('click', async function() {
    const iq1 = document.querySelector('input[name="iq1"]:checked');
    const iq2 = document.querySelector('input[name="iq2"]:checked');
    const iq3 = document.querySelector('input[name="iq3"]:checked');
    const iq4 = document.querySelector('input[name="iq4"]:checked');
    const iq5 = document.querySelector('input[name="iq5"]:checked');

    if (!iq1 || !iq2 || !iq3 || !iq4 || !iq5) {
        showModal('Please answer all IQ questions!');
        return;
    }

    const trackIQ = iqQuestions[detectedTrack];
    let iqScore = 0;
    if (iq1.value === trackIQ[0].answer) iqScore++;
    if (iq2.value === trackIQ[1].answer) iqScore++;
    if (iq3.value === trackIQ[2].answer) iqScore++;
    if (iq4.value === trackIQ[3].answer) iqScore++;
    if (iq5.value === trackIQ[4].answer) iqScore++;

    const quizData = {
        subjects: selectedSubjects,
        track: detectedTrack,
        environment: document.querySelector('input[name="q1"]:checked').value,
        activity: document.querySelector('input[name="q2"]:checked').value,
        skill: document.querySelector('input[name="q3"]:checked').value,
        iqScore: iqScore
    };

    const student = JSON.parse(localStorage.getItem('student') || 'null');
    if (student?.id) {
        try {
            const response = await fetch(`${API_BASE}/api/quiz/recommend`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    student_id: student.id,
                    ...quizData
                })
            });
            const data = await response.json();
            if (response.ok) {
                quizData.recommendation = data.recommendation;
                quizData.aiExplanation = data.aiExplanation;
                quizData.aiSource = data.aiSource;
            }
        } catch (error) {
            console.error('Backend call failed:', error.message);
        }
    }

    localStorage.setItem('quizData', JSON.stringify(quizData));
    window.location.href = 'results.html';
});