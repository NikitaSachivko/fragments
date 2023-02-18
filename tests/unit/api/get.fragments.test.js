const request = require('supertest')
const app = require('../../../src/app')
const { Fragment } = require('../../../src/model/fragment')
const logger = require('../../../src/logger')

describe('Testing GET fragments', () => {

  let responsePost1
  let responsePost2

  beforeEach(async () => {
    try {
      if (!!responsePost1?.body && !!responsePost2?.body) {
        await Fragment.delete(responsePost1.body.fragment.ownerId, responsePost1.body.fragment.id)
        await Fragment.delete(responsePost2.body.fragment.ownerId, responsePost2.body.fragment.id)
      }

      responsePost1 = await request(app)
        .post("/v1/fragments")
        .auth("user1@email.com", "password1")
        .set("Content-Type", "text/plain")
        .send("Test Fragment Data 1")

      responsePost2 = await request(app)
        .post("/v1/fragments")
        .auth("user1@email.com", "password1")
        .set("Content-Type", "text/plain")
        .send("Test Fragment Data 2 Longer Text")
    } catch (err) {
      logger.error("Error at content loading stage, check fragment.js")
    }
  })

  test('Correct data', async () => {
    const responseGetFragments = await request(app)
      .get(`/v1/fragments`)
      .auth("user1@email.com", "password1")

    const fragments = responseGetFragments.body.fragments
    const fragment1Id = responsePost1.body.fragment.id
    const fragment2Id = responsePost2.body.fragment.id

    expect(fragments).toContain(fragment1Id)
    expect(fragments).toContain(fragment2Id)
  })


  test('GET /v1/fragments?expand=1', async () => {
    const responseGetFragments = await request(app)
      .get(`/v1/fragments?expand=1`)
      .auth("user1@email.com", "password1")

    const fragment1Info = await Fragment.byId(responsePost1.body.fragment.ownerId, responsePost1.body.fragment.id)
    const fragment2Info = await Fragment.byId(responsePost2.body.fragment.ownerId, responsePost2.body.fragment.id)
    const fragmentsExpandedInfo = responseGetFragments.body.fragments

    expect(fragmentsExpandedInfo[0].id).toBe(fragment1Info.id)
    expect(fragmentsExpandedInfo[1].id).toBe(fragment2Info.id)

    expect(fragmentsExpandedInfo[0].ownerId).toBe(fragment1Info.ownerId)
    expect(fragmentsExpandedInfo[1].ownerId).toBe(fragment2Info.ownerId)

    expect(fragmentsExpandedInfo[0].type).toBe(fragment1Info.type)
    expect(fragmentsExpandedInfo[1].type).toBe(fragment2Info.type)

    expect(Number(fragmentsExpandedInfo[0].size)).toBe(Number(fragment1Info.size))
    expect(Number(fragmentsExpandedInfo[1].size)).toBe(Number(fragment2Info.size))
  })


  test(`Checking another user's fragments`, async () => {
    const responseGetFragments = await request(app)
      .get(`/v1/fragments`)
      .auth("user2@email.com", "password2")

    expect(responseGetFragments.body.fragments).toStrictEqual([])
  })


  test(`Checking expand parameter (2, '', 123123, 1, 0)`, async () => {
    let responseGetFragments = await request(app)
      .get(`/v1/fragments?expand=1`)
      .auth("user1@email.com", "password1")


    expect(responseGetFragments.body.status).toBe("ok")


    responseGetFragments = await request(app)
      .get(`/v1/fragments?expand=2`)
      .auth("user1@email.com", "password1")

    expect(responseGetFragments.body.status).toBe("error")


    responseGetFragments = await request(app)
      .get(`/v1/fragments?expand=`)
      .auth("user1@email.com", "password1")

    expect(responseGetFragments.body.status).toBe("ok")


    responseGetFragments = await request(app)
      .get(`/v1/fragments?expand=123123`)
      .auth("user1@email.com", "password1")

    expect(responseGetFragments.body.status).toBe("error")


    responseGetFragments = await request(app)
      .get(`/v1/fragments?expand=0`)
      .auth("user1@email.com", "password1")

    expect(responseGetFragments.body.status).toBe("ok")
  })

})

