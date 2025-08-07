import { http } from "./axios";

export const fetcher = <T>(url: string) =>
  http<T>({ url }).then(res => res.data);
