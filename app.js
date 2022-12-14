const path = require('path');
const EventSource = require('eventsource');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

let data = []; // stores all event source data

// connect to SSE data and ingest

const sse = new EventSource('http://live-test-scores.herokuapp.com/scores');
console.log(`Connecting - ${sse.url}`);

sse.onopen = () => {
    console.log(`Connection Open - ${sse.url}`);
}

sse.addEventListener('score', event => {
    data.push(JSON.parse(event.data));
})

sse.onerror = () => {
    console.log(`Connection Closed - ${sse.url}`);
    console.log('EventSource failed.');
}

// Routes

app.get("/students", (req, res) => {
  let students = [];
  for (let i = 0; i < data.length; i++) {
    if ("exam" in data[i]) {
      students.push(data[i].studentId);
    }
  }

  let uniqueStudents = students.filter((student, index) => students.indexOf(student) === index);
  res.send(uniqueStudents);
});

app.get("/students/:id", (req, res) => {
  let studentId = req.params.id;
  let studentGrades = [];
  let studentAverageGrade = 0;

  for (let i = 0; i < data.length; i++) {
    if (studentId == data[i].studentId && "exam" in data[i]) {
      studentGrades.push({
        exam: data[i].exam,
        score: data[i].score
      });
    }
  }

  for (let i = 0; i < studentGrades.length; i++) {
    studentAverageGrade += studentGrades[i].score;
  }

  studentAverageGrade /= studentGrades.length;
  res.send({ studentId, studentGrades, studentAverageGrade});
});

app.get("/exams", (req, res) => {
  let exams = [];
  for (let i = 0; i < data.length; i++) {
    exams.push(data[i].exam);
  }

  let uniqueExams = exams.filter((exam, index) => exams.indexOf(exam) === index);
  res.send(uniqueExams);
});

app.get("/exams/:number", (req, res) => {
  let allResults = [];
  let examNumber = req.params.number;
  averageScoreAcrossAllStudents = 0;

  for (let i = 0; i < data.length; i++) {
    if (examNumber == data[i].exam) {
      allResults.push({
        studentId: data[i].studentId, 
        score: data[i].score 
      });
    }
  }

  for (let i = 0; i < allResults.length; i++) {
    averageScoreAcrossAllStudents += allResults[i].score;
  }

  averageScoreAcrossAllStudents /= allResults.length;
  res.send({ examNumber, allResults, averageScoreAcrossAllStudents });
})

module.exports = app.listen(3000, () => {
  console.log("listening on port", 3000);
});
