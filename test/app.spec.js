let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
chai.should()
chai.use(chaiHttp);
var expect = chai.expect;

let studentId = "";
let examNumber = 0;

describe('/GET students', () => {
  it('it should GET all the students with at least one exam score', (done) => {
    // wait for server to ingest some data first before executing chai requests
    setTimeout(() => {
      chai.request(server)
      .get('/students')
      .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.not.be.eql(0);
          studentId = res.body[0];
          done()
      });
    }, 5000)
  });
});

describe('/GET students/:id', () => {
  it('should get students grades', (done) => {
    chai.request(server)
    .get(`/students/${studentId}`)
    .end((err, res) => {
      res.body.should.be.a('Object');
      res.body.should.contain.property('studentId');
      res.body.should.contain.property('studentGrades');
      res.body.should.contain.property('studentAverageGrade');
      Object.values(res.body).forEach((item) => {
        expect(item).to.not.equal(null)
      })
      done();
    });
  });
});

describe('/GET exams', () => {
  it('should get all unique exams', (done) => {
    chai.request(server)
    .get(`/exams`)
    .end((err, res) => {
      res.body.should.be.a('array');
      res.body.length.should.not.be.eql(0);
      examNumber = res.body[0];
      done();
    });
  })
});

describe('/GET exams/:number', () => {
  it('should return all results of exam and average grade', (done) => {
    chai.request(server)
    .get(`/exams/${examNumber}`)
    .end((err, res) => {
      res.body.should.be.a('Object');
      res.body.should.contain.property('allResults');
      res.body.should.contain.property('examNumber');
      res.body.should.contain.property('averageScoreAcrossAllStudents');
      Object.values(res.body).forEach((item) => {
        expect(item).to.not.equal(null)
      })
      done();
    });
  });
});
