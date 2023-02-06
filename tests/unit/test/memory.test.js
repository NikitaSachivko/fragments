const memoryIndex = require('../../../src/model/data/memory/index')

describe('memory-db index', () => {

  const fragmentTestData = {
    "id": "30a84843-0cd4-4975-95ba-b96112aea189",
    "ownerId": "11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a",
    "created": "2021-11-02T15:09:50.403Z",
    "updated": "2021-11-02T15:09:50.403Z",
    "type": "text/plain",
    "size": 256
  }

  test('writeFragment: should return nothing', async () => {
    const result = await memoryIndex.writeFragment(fragmentTestData)
    expect(result).toBe(undefined)
  })


  test('writeFragment: should throw error for empty, not valid owner or id', () => {
    const fragmentNoOwner = {
      "id": "30a84843-0cd4-4975-95ba-b96112aea189",
    }

    const fragmentNoId = {
      "ownerId": "11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a",
    }

    expect(async () => await memoryIndex.writeFragment()).rejects.toThrow()
    expect(async () => await memoryIndex.writeFragment(fragmentNoOwner)).rejects.toThrow()
    expect(async () => await memoryIndex.writeFragment(fragmentNoId)).rejects.toThrow()
  })


  test('readFragment: return valid created, updated, type', async () => {
    const result = await memoryIndex.readFragment(fragmentTestData.ownerId, fragmentTestData.id)
    expect(fragmentTestData.created).toBe(result.created)
    expect(fragmentTestData.updated).toBe(result.updated)
    expect(fragmentTestData.type).toBe(result.type)
  })


  test('readFragment: should throw error if no valid owner and id', async () => {
    expect(async () => await memoryIndex.readFragment()).rejects.toThrow()
    expect(async () => await memoryIndex.readFragment(fragmentTestData.ownerId)).rejects.toThrow()
    expect(async () => await memoryIndex.readFragment(fragmentTestData.id)).rejects.toThrow()
  })


  test('writeFragmentData: should return valid data', async () => {
    const dataBufferType = Buffer.from([9, 0, 0, 0])
    await memoryIndex.writeFragmentData(fragmentTestData.ownerId, fragmentTestData.id, dataBufferType)

    const result = await memoryIndex.readFragmentData(fragmentTestData.ownerId, fragmentTestData.id)
    expect(result).toBe(dataBufferType)
  })


  test('writeFragmentData: should not write data for invalid credentials', async () => {
    const dataBufferType = Buffer.from([9, 0, 0, 0])
    expect(async () => await memoryIndex.writeFragmentData(dataBufferType)).rejects.toThrow()
  })


  test('readFragmentData: should not return data for invalid credentials', async () => {
    const dataBufferType = Buffer.from([9, 0, 0, 0])
    await memoryIndex.writeFragmentData(fragmentTestData.ownerId, fragmentTestData.id, dataBufferType)

    expect(async () => await memoryIndex.readFragmentData()).rejects.toThrow()
    expect(async () => await memoryIndex.readFragmentData(fragmentTestData.ownerId)).rejects.toThrow()
    expect(async () => await memoryIndex.readFragmentData(fragmentTestData.id)).rejects.toThrow()
  })


  test('listFragments: should find fragment by owner', async () => {
    const result = await memoryIndex.listFragments(fragmentTestData.ownerId)

    expect(result[0]).toBe(fragmentTestData.id)
  })


  test('listFragments: should find multiple fragments', async () => {
    const fakeFragment1 = {
      "id": "1",
      "ownerId": "11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a",
      "created": "2021-11-02T15:09:50.403Z",
      "updated": "2021-11-02T15:09:50.403Z",
      "type": "text/plain",
      "size": 256
    }

    const fakeFragment2 = {
      "id": "2",
      "ownerId": "11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a",
      "created": "2021-11-02T15:09:50.403Z",
      "updated": "2021-11-02T15:09:50.403Z",
      "type": "text/plain",
      "size": 256
    }

    const fakeFragment3 = {
      "id": "3",
      "ownerId": "11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a",
      "created": "2021-11-02T15:09:50.403Z",
      "updated": "2021-11-02T15:09:50.403Z",
      "type": "text/plain",
      "size": 256
    }

    await memoryIndex.writeFragment(fakeFragment1)
    await memoryIndex.writeFragment(fakeFragment2)
    await memoryIndex.writeFragment(fakeFragment3)

    const result = await memoryIndex.listFragments(fragmentTestData.ownerId)

    expect(result[0]).toBe('1')
    expect(result[1]).toBe('2')
    expect(result[2]).toBe('3')
  })

})


test('listFragments: should reject user without credentials', async () => {
  expect(async () => await memoryIndex.listFragments()).rejects.toThrow()
})

test('listFragments: should return [] is wrong ownerId', async () => {
  const result = await memoryIndex.listFragments("fake-user-id")
  expect(result).toHaveLength(0)
})


test('deleteFragment: should delete fragment and data', async () => {
  const fakeFragment = {
    "id": "1",
    "ownerId": "11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a",
    "created": "2021-11-02T15:09:50.403Z",
    "updated": "2021-11-02T15:09:50.403Z",
    "type": "text/plain",
    "size": 256
  }
  const dataBuffer = Buffer.from([9, 0, 0, 0])

  await memoryIndex.writeFragment(fakeFragment)

  await memoryIndex.writeFragmentData(fakeFragment.ownerId, fakeFragment.id, dataBuffer)

  let result = memoryIndex.readFragmentData(fakeFragment.ownerId, fakeFragment.id)

  await memoryIndex.deleteFragment(fakeFragment.ownerId, fakeFragment.id)
  result = await memoryIndex.readFragmentData(fakeFragment.ownerId, fakeFragment.id)

  expect(result).toBe(undefined)
})



