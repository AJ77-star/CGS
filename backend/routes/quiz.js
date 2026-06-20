const express = require('express');
const router = express.Router();
const pool = require('../db');
const { spawn } = require('child_process');
const path = require('path');
require('dotenv').config();

function runCLIPS(clipsInput) {
    return new Promise((resolve, reject) => {
        const clipsProcess = spawn('clips', [], { shell: true });
        let output = '';
        let error = '';

        clipsProcess.stdout.on('data', (data) => { output += data.toString(); });
        clipsProcess.stderr.on('data', (data) => { error += data.toString(); });
        clipsProcess.on('close', (code) => {
            if (code !== 0) reject(new Error(error || 'CLIPS exited with code ' + code));
            else resolve(output);
        });

        clipsProcess.stdin.write(clipsInput);
        clipsProcess.stdin.end();
    });
}

const fallbackRecommendations = {
    science: {
        medicine:    'Medicine / Health Sciences',
        engineering: 'Engineering / Technology',
        agriculture: 'Agriculture / Environmental Science',
        research:    'Scientific Research / Pure Sciences',
        default:     'Science & Technology'
    },
    commercial: {
        accounting:  'Accounting / Finance',
        marketing:   'Marketing / Business Administration',
        finance:     'Banking & Finance',
        business:    'Business Management / Entrepreneurship',
        default:     'Business & Commerce'
    },
    arts: {
        law:        'Law / Political Science',
        media:      'Mass Communication / Journalism',
        education:  'Education / Teaching',
        socialwork: 'Social Work / Counselling',
        default:    'Humanities & Social Sciences'
    }
};

router.post('/recommend', async (req, res) => {
    const { student_id, subjects, track, environment, activity, skill, iqScore } = req.body;

    if (!student_id || !subjects || !track || !environment || !activity || !skill || iqScore == null) {
        return res.status(400).json({ message: 'All quiz fields are required.' });
    }

    const subjectsArr = Array.isArray(subjects) ? subjects : [subjects].filter(Boolean);

    let recommendation = null;
    let aiExplanation = null;
    let aiSource = 'fallback';

    // --- Step 1: Try CLIPS ---
    try {
        const clipsInput = `
            (load "${path.join(__dirname, '../../clips/career_rules.clp').replace(/\\/g, '/')}")
            (assert (track ${track}))
            (assert (activity ${activity}))
            (assert (skill ${skill}))
            (assert (iq-score ${iqScore}))
            (run)
            (facts)
            (exit)
        `;
        const clipsOutput = await runCLIPS(clipsInput);
        const match = clipsOutput.match(/recommendation\s+"([^"]+)"/);
        recommendation = match ? match[1] : null;
    } catch (err) {
        console.error('CLIPS failed, using fallback:', err.message);
    }

    // Fallback recommendation if CLIPS didn't produce one
    if (!recommendation) {
        const trackRecs = fallbackRecommendations[track] || fallbackRecommendations.science;
        recommendation = trackRecs[activity] || trackRecs.default;
    }

    // --- Step 2: Try Groq AI ---
    if (process.env.GROQ_API_KEY) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);
        try {
            const aiRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'llama-3.1-8b-instant',
                    max_tokens: 300,
                    messages: [{
                        role: 'user',
                        content: `You are a career guidance counsellor in Nigeria. A secondary school student just completed a career quiz. Write 3-4 encouraging sentences explaining why their recommended career suits them. Speak directly to the student. Be warm and specific.

Student profile:
- Academic Track: ${track}
- Favourite Subjects: ${subjectsArr.join(', ')}
- Preferred Work Environment: ${environment}
- Favourite Activity: ${activity}
- Strongest Skill: ${skill}
- Aptitude Score: ${iqScore}/5
- Recommended Career: ${recommendation}`
                    }]
                }),
                signal: controller.signal
            });
            clearTimeout(timeout);
            if (!aiRes.ok) {
                const errBody = await aiRes.text();
                throw new Error(`Groq API error ${aiRes.status}: ${errBody}`);
            }
            const aiData = await aiRes.json();
            const content = aiData.choices?.[0]?.message?.content?.trim();
            if (content) {
                aiExplanation = content;
                aiSource = 'groq';
            }
        } catch (err) {
            clearTimeout(timeout);
            console.error('Groq AI failed:', err.message);
        }
    }

    // Fallback: generate a personalised explanation from quiz data
    if (!aiExplanation) {
        const skillLabels = {
            analytical: 'analytical thinking', technical: 'technical expertise',
            practical: 'hands-on practical skills', creative: 'creative problem solving',
            numerical: 'numerical and data analysis', communication: 'strong communication',
            leadership: 'leadership ability', strategic: 'strategic thinking',
            empathy: 'empathy and people skills', research: 'research and critical thinking'
        };
        const envLabels = {
            office: 'structured office environments', bank: 'banking and finance settings',
            entrepreneurship: 'entrepreneurial and business environments', management: 'management and administration',
            lab: 'laboratory and research settings', fieldwork: 'fieldwork and outdoor environments',
            computing: 'technology-driven spaces', design: 'design and engineering environments',
            writing: 'creative and writing spaces', debating: 'public speaking and debate',
            teaching: 'educational and teaching environments', helping: 'counselling and people-support roles'
        };
        const closings = [
            `Keep pushing forward with your profile, success in this field is well within your reach!`,
            `Stay focused and keep developing your strengths a bright future in this career awaits you!`,
            `You have a compelling profile for this path embrace it with confidence and hard work!`,
            `With dedication and the right training, you are poised to make a real impact in this field!`
        ];
        const openings = [
            `Based on your ${track} track background and interest in ${subjectsArr.join(', ')}, our career analysis strongly points to ${recommendation} as your ideal path.`,
            `Your academic profile in the ${track} track, particularly your engagement with ${subjectsArr.join(', ')}, makes ${recommendation} a natural and exciting career direction for you.`,
            `After analysing your quiz responses, ${recommendation} stands out as the career that best matches your ${track} track profile and your subjects ${subjectsArr.join(', ')}.`,
            `Your combination of ${track} track studies and subjects like ${subjectsArr.join(', ')} places you in an excellent position to pursue a career in ${recommendation}.`
        ];
        const middles = [
            `Your ${skillLabels[skill] || skill} is a core competency in this field, and your comfort with ${envLabels[environment] || environment} means you will adapt quickly to a professional setting.`,
            `The ${envLabels[environment] || environment} you thrive in aligns closely with where professionals in ${recommendation} spend most of their careers, and your ${skillLabels[skill] || skill} will set you apart.`,
            `Professionals in ${recommendation} rely heavily on ${skillLabels[skill] || skill}, which you have already demonstrated and your preference for ${envLabels[environment] || environment} is a perfect match for this career.`
        ];
        const iqLines = [
            iqScore >= 4 ? `Your aptitude score of ${iqScore}/5 reflects a sharp and capable mind exactly what this career demands.`
            : iqScore >= 3 ? `Your aptitude score of ${iqScore}/5 shows solid intellectual potential that will serve you well in this career.`
            : `Your aptitude score of ${iqScore}/5 shows there is room to grow, and that growth combined with your passion is what will drive your success.`
        ];

        const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
        aiExplanation = `${pick(openings)} ${pick(middles)} ${iqLines[0]} ${pick(closings)}`;
    }

    // --- Step 3: Always save to database ---
    try {
        await pool.query(
            `INSERT INTO quiz_results
            (student_id, subjects, track, environment, activity, skill, iq_score, recommendation, ai_explanation)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [student_id, subjects, track, environment, activity, skill, iqScore, recommendation, aiExplanation]
        );
    } catch (dbErr) {
        console.error('DB save failed:', dbErr.message);
    }

    res.status(200).json({ recommendation, aiExplanation, aiSource });
});

module.exports = router;
