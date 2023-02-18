const request = require('supertest')
const app = require('../../../src/app')
const postFragmentTest = require('./post.fragment.test')

describe('Testing GET /v1/fragments/:id/info', () => {

  let responsePost

  beforeAll(async () => {
    await postFragmentTest
  })

  beforeEach(async () => {
    responsePost = await request(app)
      .post("/v1/fragments")
      .auth("user1@email.com", "password1")
      .set("Content-Type", "text/plain")
      .send("Test Fragment Data")
  })


  test('Correct data, correct id', async () => {
    const responseGetInfo = await request(app)
      .get(`/v1/fragments/${responsePost.body.fragment.id}/info`)
      .auth("user1@email.com", "password1")

    const fragment = responseGetInfo.body.fragment
    const fragmentPost = responsePost.body.fragment

    expect(fragment.id).toEqual(fragmentPost.id)
    expect(fragment.ownerId).toEqual(fragmentPost.ownerId)
    expect(fragment.type).toEqual(fragmentPost.type)
    expect(Number(fragment.size)).toEqual(Number(fragmentPost.size))
  })

  test('Wrong id', async () => {
    const wrongId = "asdasd"
    const responseGetInfo = await request(app)
      .get(`/v1/fragments/${wrongId}/info`)
      .auth("user1@email.com", "password1")

    const fragment = responseGetInfo.body

    expect(fragment.status).toEqual("error")
    expect(fragment.error.code).toEqual(400)
    expect(fragment.error.message).toBe(`No fragment with id = ${wrongId}`)

  })
})
