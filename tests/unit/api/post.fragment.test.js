const request = require('supertest')
const app = require('../../../src/app')

describe('Testing successful POST request', () => {

  // Case when all parameters are correct
  test('correct data', async () => {

    const response = await request(app)
      .post("/v1/fragments")
      .auth("user1@email.com", "password1")
      .set("Content-Type", "text/plain")
      .send("This is a fragment")

    expect(response.statusCode).toEqual(201) // checking code
    expect(response.body).toHaveProperty("fragment") // checking if we have fragment object
    expect(response.body.fragment).toHaveProperty("id") // checking if fragment has id property
    expect(response.body.fragment).toHaveProperty("type", "text/plain") // checking if type is set correctly
    expect(response.body.fragment).toHaveProperty("size", 18) // checking if size = 18
    expect(response.header).toHaveProperty("location") // checking if location header is set correctly
    expect(response.header.location).toContain(`/v1/fragments/${response.body.fragment.id}`)
  })


  //Testing wrong email
  test('wrong email', async () => {

    const response = await request(app)
      .post("/v1/fragments")
      .auth("WRONG.EMAIL", "password1")
      .set("Content-Type", "text/plain")
      .send("This is a fragment")

    expect(response.statusCode).toEqual(401)
  })


  //Testing wrong password
  test('wrong password', async () => {

    const response = await request(app)
      .post("/v1/fragments")
      .auth("user1@email.com", "wrong_password")
      .set("Content-Type", "text/plain")
      .send("This is a fragment")

    expect(response.statusCode).toEqual(401)
  })


  //Testing unsupported content type
  test('unsupported content type', async () => {

    const response = await request(app)
      .post("/v1/fragments")
      .auth("user1@email.com", "password1")
      .set("Content-Type", "text/html")
      .send("This is a fragment")

    expect(response.body.error.code.code).toEqual(415)
    expect(response.body.error.code.message).toEqual("Unsupported Content-Type")
  })
})
