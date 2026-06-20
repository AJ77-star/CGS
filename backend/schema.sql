CREATE DATABASE career_guidance_db;

\c career_guidance_db;

CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS quiz_results (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id),
    subjects TEXT[],
    track VARCHAR(50),
    environment VARCHAR(50),
    activity VARCHAR(50),
    skill VARCHAR(50),
    iq_score INTEGER,
    recommendation TEXT,
    ai_explanation TEXT
);

CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id),
    counsellor_name VARCHAR(255),
    session_date DATE NOT NULL,
    session_time TIME NOT NULL,
    mode VARCHAR(20) NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS counsellors (
    id SERIAL PRIMARY KEY,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);
