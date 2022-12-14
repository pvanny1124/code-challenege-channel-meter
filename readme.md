To run the project, please use ```node app.js```

To test the project, please use ```npm run test```


How to use the API:

/GET students -- gets list of all students with at least one exam score
/GET students/:id -- use an id from /GET students, and get the student's scores so far
/GET exams -- gets list of all exams so far
/GET exams/:number -- use an exam number from /GET exams and get all results for the given exam as well as average score for all students