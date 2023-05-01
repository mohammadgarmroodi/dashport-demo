import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import type { AuthContextType as JwtAuthContextType } from "../../contexts/auth/jwt-context";
import { AuthContext } from "../../contexts/auth/jwt-context";
import { clientInstance, serverInstance } from "../instance";

//Context
type AuthContextType = JwtAuthContextType;

export const useAuth = <T = AuthContextType>() => useContext(AuthContext) as T;

//Api

const getAccessToken = async ({ code }: { code?: string | string[] }) => {
  const { data } = await clientInstance.get("/api/server?code=" + code);
  return data;
};

function useGetAccessToken({
  code,
  onSuccessHandle,
  onErrorHandle
}: {
  code?: string | string[];
  onErrorHandle: (error: unknown) => void;
  onSuccessHandle: (accessToken: string) => void;
}) {
  return useQuery(["access-token"], () => getAccessToken({ code }), {
    enabled: !!code,
    onSuccess: (response) => {
      onSuccessHandle(response.data);
    },
    onError: (error: unknown) => onErrorHandle(error),
  });
}

export { useGetAccessToken };
