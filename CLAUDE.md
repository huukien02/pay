# CLAUDE.md

Ví Thu Chi (Personal Finance Hub) — Next.js (App Router) + Supabase. Dự án cá nhân, **chuẩn chất lượng senior**. Xem `kickoff.txt` để biết kế hoạch đầy đủ; file này là hợp đồng làm việc cho phần code.

## Luật vàng (không được vi phạm)

1. **Tiền không bao giờ là float.** Lưu dạng `NUMERIC(20,4)` trong Postgres. Không tính toán tiền bằng `number` của JS — dùng util decimal-safe ở `lib/money`. Số tiền luôn lưu **dương**; chiều thu/chi lấy từ `transactions.type`.
2. **Database là nguồn chân lý.** Số dư và số liệu tổng hợp được tính bằng SQL (view / function / trigger), không tính lại ở client.
3. **Không bao giờ import shadcn primitives trực tiếp.** Code app/feature chỉ import từ component layer (`components/core`, `components/forms`, `components/patterns`, `components/charts`). `components/ui/*` coi như vendor code. Ép buộc bằng ESLint `no-restricted-imports`.
4. **RLS trên mọi bảng có user.** Mọi bảng có `user_id` đều bật Row Level Security với policy `auth.uid() = user_id`. Không bao giờ lộ `service_role` key ra client.
5. **Một Zod schema cho mỗi entity, dùng lại khắp nơi.** Định nghĩa ở `lib/validations/*`. RHF dùng `zodResolver`, Server Action gọi `.parse()`, TS type suy ra từ schema. Không định nghĩa lại shape ở chỗ khác.
6. **Mọi form đi qua `<Form>` chung; mọi field đi qua field component chung.** Không gọi `useForm`/`register`/`Controller` trực tiếp trong feature. `<Form>` lo wire RHF + gọi action + map `fieldErrors` về `setError` + bắn toast.
7. **Một API toast duy nhất** (`lib/toast.ts` bọc `sonner`). Không gọi `sonner` trực tiếp. Action `ok` → toast success, `error` → toast error.
8. **Mọi Server Action định nghĩa qua `next-safe-action`** (`lib/safe-action.ts`). Dùng `authActionClient` (middleware chặn chưa-đăng-nhập + inject `userId`) cho mọi action chạm dữ liệu người dùng. `validationErrors` map về RHF `setError` qua adapter. Không tự viết parse/try-catch ở từng action.
9. **Mọi hàm list trong DAL trả về cùng một format `Paginated<T>`** (`lib/data/types.ts`), nhận `ListParams`. Phân trang bằng Supabase `.range()` + `count: 'exact'`. Không trả mảng trần cho list.
10. **Phân trang dùng `<Pagination>` chung, state nằm trong URL searchParams** (`?page=&pageSize=`), đồng bộ qua `usePagination`. Không quản page bằng local state. Query key phải gồm `{ page, pageSize, sort, filter }`.

## Kiến trúc — Pattern C (Hybrid)

- **Đọc:** RSC fetch qua Data Access Layer + `prefetchQuery` → `HydrationBoundary` → client `useQuery` render không cần spinner.
- **Ghi:** `<Form>` (RHF) → `useMutation({ mutationFn: safeAction })` → action (`authActionClient` tự validate Zod + auth) → DAL → Supabase. `onSuccess` invalidate query / `revalidatePath` + toast; `validationErrors` → `setError`.
- **Không dùng REST API route cho CRUD** — Server Action (qua `next-safe-action`) là tầng RPC type-safe. Route Handler chỉ dành cho webhook / import / export.
- **Kết quả action theo chuẩn `next-safe-action`** (`{ data, serverError, validationErrors }`), không throw cho lỗi nghiệp vụ dự kiến. `<Form>` map: `serverError` → toast error, `validationErrors` → RHF `setError`, `data` → toast success + invalidate.

## Cấu trúc thư mục

```
app/
  providers.tsx         gom QueryClientProvider + ThemeProvider + <Toaster/>
  ...                   route group: (auth), (app)/dashboard|accounts|transactions|budgets|settings
components/
  ui/                   shadcn primitives — VENDOR, không sửa, không import ngoài components/core
  core/                 design system layer — API công khai DUY NHẤT (Button, Input, Card, Dialog...)
  forms/
    Form.tsx            <Form> abstraction: nhận schema + action, tự wire RHF
    fields/             TextField, MoneyField, SelectField, ComboboxField, DateField... (bọc RHF context)
  patterns/             block + state chung (DataTable, EmptyState, ErrorState, LoadingState, ConfirmDialog, Pagination)
  charts/               wrapper Recharts
features/<f>/
  components/           UI riêng feature — chỉ dùng core/forms/patterns
  actions/              server actions (định nghĩa qua authActionClient)
  queries/             react-query hooks
lib/
  supabase/             server.ts, client.ts, middleware.ts, database.types.ts (@supabase/ssr)
  data/                 Data Access Layer — TẤT CẢ query Supabase nằm ở đây
    types.ts            ListParams + Paginated<T> — format trả về duy nhất cho list
  validations/          zod schema (dùng chung RHF + server action)
  safe-action.ts        next-safe-action: actionClient + authActionClient (auth middleware, inject userId)
  toast.ts              notify.success/error — bọc sonner, API toast duy nhất
  format/               formatMoney, formatDate (vi-VN)
  constants/            enums dùng chung Zod + UI (TRANSACTION_TYPES, ACCOUNT_TYPES...)
  hooks/                useDisclosure, useConfirm, useDebounce...
  query-keys.ts         query key factory
  money/                util xử lý tiền decimal-safe
supabase/
  migrations/           SQL có version (nguồn chân lý của schema)
  functions/            edge functions
```

## Quy ước

- **TypeScript strict.** Không dùng `any`. Suy type từ Zod và Supabase generated types.
- **Truy cập dữ liệu chỉ qua `lib/data`.** RSC và Server Action đều gọi DAL — không query Supabase trực tiếp trong component.
- **Query key lấy từ `lib/query-keys.ts`** — không viết magic-string key inline.
- **Variant component** định nghĩa bằng `cva()` ở `components/core`; không lặp lại tổ hợp `className` ở feature code. Dùng `cn()` để merge.
- **Thêm component shadcn** = chạy shadcn CLI vào `components/ui`, rồi bọc ở `components/core` *trước khi* feature được phép dùng.
- **Đổi schema** đi qua `supabase migration` (SQL có version). Không sửa DB bằng tay mà không có migration.
- **Validate ở biên:** action gắn Zod schema qua `next-safe-action` (`.schema()`) — lib tự validate trước khi chạy. DB cũng tự ràng buộc bất biến (`CHECK amount > 0`, FK, `NOT NULL`).

## Lệnh

```
npm run dev          # chạy dev (Turbopack)
npm run build        # production build (chạy luôn typecheck)
npm run start        # chạy bản build
npm run lint         # eslint (gồm rule cấm import components/ui)
npm run typecheck    # tsc --noEmit
npm test             # vitest run (unit: money, pagination, zod schemas)
npm run test:watch   # vitest watch

# Thêm UI primitive: chạy CLI vào components/ui RỒI bọc ở components/core
npx shadcn@latest add <component>

# Supabase — đã link tới project cloud (ref tfaieethdkffhsnkpeia)
npx supabase migration new <name>          # tạo file migration mới
npx supabase db push                       # đẩy migration lên cloud
npx supabase gen types typescript --project-id tfaieethdkffhsnkpeia --schema public > lib/supabase/database.types.ts
# (chạy lại gen types MỖI KHI đổi schema)
# Test bổ sung (sau): playwright (e2e) · pgTAP (RLS/SQL)
```

> Đổi schema = thêm file trong `supabase/migrations/` -> `db push` -> `gen types`.
> KHÔNG sửa DB bằng tay trên dashboard (sẽ lệch với migration trong repo).

> Cấu hình: copy `.env.example` -> `.env.local` rồi điền URL + anon key của Supabase.

## Lưu ý stack (đã scaffold)

- Next.js 16 (App Router, Turbopack) + React 19 + Tailwind v4.
- shadcn chạy trên **Base UI** (không phải Radix): Select dùng `value`/`onValueChange` + prop `items`; Switch/Checkbox dùng `checked`/`onCheckedChange`.
- Middleware theo convention mới Next 16: file `proxy.ts` (không phải `middleware.ts`), export hàm `proxy`.

## Khi phân vân

- Ưu tiên đẩy logic vào Postgres hơn là client.
- Ưu tiên Server Action hơn là tạo API route mới.
- Ưu tiên mở rộng tầng `core`/`forms` hơn là import `components/ui` trực tiếp (bị cấm).
- Nếu một phép tính tiền có vẻ thuộc về JS, nhiều khả năng nó thuộc về SQL.
