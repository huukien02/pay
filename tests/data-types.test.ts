import { describe, expect, it } from "vitest"

import {
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  getRange,
  normalizeListParams,
  paginate,
} from "@/lib/data/types"

describe("normalizeListParams", () => {
  it("mặc định page=1, pageSize=DEFAULT", () => {
    expect(normalizeListParams()).toMatchObject({
      page: 1,
      pageSize: DEFAULT_PAGE_SIZE,
    })
  })

  it("ép page tối thiểu 1", () => {
    expect(normalizeListParams({ page: 0 }).page).toBe(1)
    expect(normalizeListParams({ page: -5 }).page).toBe(1)
  })

  it("giới hạn pageSize ở MAX", () => {
    expect(normalizeListParams({ pageSize: 9999 }).pageSize).toBe(MAX_PAGE_SIZE)
    expect(normalizeListParams({ pageSize: 0 }).pageSize).toBe(1)
  })
})

describe("getRange", () => {
  it("trang 1", () => {
    expect(getRange(1, 20)).toEqual({ from: 0, to: 19 })
  })
  it("trang 3", () => {
    expect(getRange(3, 20)).toEqual({ from: 40, to: 59 })
  })
})

describe("paginate", () => {
  it("tính pageCount đúng", () => {
    const result = paginate([1, 2, 3], 45, 1, 20)
    expect(result.pageCount).toBe(3)
    expect(result.total).toBe(45)
    expect(result.data).toHaveLength(3)
  })

  it("pageCount tối thiểu 1 khi rỗng", () => {
    expect(paginate([], 0, 1, 20).pageCount).toBe(1)
  })
})
