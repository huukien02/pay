import { describe, expect, it } from "vitest"

import {
  ACCOUNT_TYPES,
  ACCOUNT_TYPE_LABELS,
  TRANSACTION_TYPES,
  toOptions,
} from "@/lib/constants"

describe("toOptions", () => {
  it("ghép value với label tiếng Việt", () => {
    const options = toOptions(ACCOUNT_TYPES, ACCOUNT_TYPE_LABELS)
    expect(options).toHaveLength(ACCOUNT_TYPES.length)
    expect(options[0]).toEqual({ value: "cash", label: "Tiền mặt" })
  })
})

describe("enums", () => {
  it("TRANSACTION_TYPES gồm đủ 3 loại", () => {
    expect(TRANSACTION_TYPES).toEqual(["income", "expense", "transfer"])
  })
})
