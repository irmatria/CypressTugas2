require('dotenv').config();
const supertest = require('supertest');
const chai = require('chai');
const expect = chai.expect;

const BASE_URL = process.env.BASE_URL;
const request = supertest(BASE_URL);

let token;
let bookingId;
let status = 200;

describe('E2E API Testing', function () {
  this.timeout(5000);
  
  // API auth 
  it('Login via auth API and get token', async function () {
    const Response = await request
      .post('/auth')
      .send({
        username: process.env.EMAIL,
        password: process.env.PASSWORD
      });

    expect(Response.status).to.equal(200);
    expect(Response.body).to.have.property('token');
    token = Response.body.token;
  });
  
  // API createBooking
  it('Create a new booking and get bookingId', async function () {
    const bookingData = require('./bookingData.json'); 
  
    const Response = await request
      .post('/booking')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')  
      .send(bookingData);
  
    console.log('Status create:', Response.status);
    console.log('Body create:', Response.body);
  
    expect(Response.status).to.equal(200);
    expect(Response.body).to.have.property('bookingid');
    bookingId = Response.body.bookingid;
  });

  // API getBooking
  it('Get booking by bookingId and verify booking details', async function () {
    const Response = await request
      .get(`/booking/${bookingId}`)
      .set('Accept', 'application/json'); 
  
    expect(Response.status).to.equal(200);
    expect(Response.body).to.deep.include(require('./bookingData.json'));
  });
  
  // API deleteBooking
  it('Delete booking using token', async function () {
    const Response = await request
      .delete(`/booking/${bookingId}`)
      .set('Cookie', `token=${token}`);
  
    expect(Response.status).to.equal(201);
  });

});
