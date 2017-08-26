// const request = require('request');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

module.exports.run = () => {
	describe('Server Tests', () => {

		it('should respond GET request for root with 200 status code and index.html', (done) => {
			chai.request(server)
			.get('/')
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res).to.be.html;
				done();
			});
		});

		it('should get res of null when GET from /currentUser if not logged in', (done) => {
			chai.request(server)
			.get('/currentUser')
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.be.empty;
				done();
			});
		});

		it('should get all posts from /posts', (done) => {
			chai.request(server)
			.get('/posts')
			.end((err, res) => {
				expect(res).to.have.status(200);
				done();
			});
		});

		it('should return "Invalid API request" for invalid API route', (done) => {
			chai.request(server)
			.get('/api/hello')
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res.text).to.equal('Invalid API request');
				done();
			});
		});

	});
}