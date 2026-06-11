import {
  QueryClient,
  defaultShouldDehydrateQuery,
  isServer,
} from "@tanstack/react-query"

/**
 * QueryClient dùng chung. Trên server tạo mới mỗi request; trên browser dùng
 * singleton. Cho phép dehydrate cả query "pending" để hỗ trợ prefetch ở RSC
 * (Pattern C: RSC prefetch -> HydrationBoundary -> client useQuery).
 */
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined

export function getQueryClient() {
  if (isServer) return makeQueryClient()
  if (!browserQueryClient) browserQueryClient = makeQueryClient()
  return browserQueryClient
}
