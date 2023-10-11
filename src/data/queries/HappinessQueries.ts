// export function getSelf(): UseQueryResult<User> {
//   const { api } = useApi();
//
//   return useQuery(
//     "get self",
//     () => api.get("/user/self").then((res) => res.data),
//     {
//       refetchOnWindowFocus: false,
//       refetchOnMount: false,
//       refetchOnReconnect: false,
//       staleTime: 1000 * 60 * 60 * 24,
//       cacheTime: 1000 * 60 * 5,
//     },
//   );
// }
