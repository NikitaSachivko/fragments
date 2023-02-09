const extensionToContentType = require('../../../src/helper_functions/extension-to-content-type')


describe('testing extension convert', () => {

  test('Empty extension - toBe text/plain', async () => {
    const type = extensionToContentType("")
    expect(type).toEqual("text/plain") // checking code
  })

  test('.html - toBe text/html', async () => {
    const type = extensionToContentType("html")
    expect(type).toEqual("text/html") // checking code
  })

  test('.txt - toBe text/plain', async () => {
    const type = extensionToContentType("txt")
    expect(type).toEqual("text/plain") // checking code
  })

  test('.wrong - toBe Not supported extension', async () => {
    const type = extensionToContentType("wrong")
    expect(type).toEqual("Not supported extension") // checking code
  })


})

