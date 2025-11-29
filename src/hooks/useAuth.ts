import { KeyedMutator } from "swr";
import { AuthUser } from "@/interfaces/AuthUser";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";

interface AuthResponse {
    user: AuthUser | undefined;
    isLoading: boolean;
    isLoggedIn: boolean;
    mutate: KeyedMutator<{
        isLoggedIn: boolean;
        user?: AuthUser;
    } | undefined>;
}

const useAuth = (): AuthResponse => {
    const { isLoading, data, mutate } = useGet<{
        isLoggedIn: boolean;
        user?: AuthUser;
    }>(apis.authInternalUrl);

    return {
        isLoading,
        user: data?.user,
        isLoggedIn: !!data?.isLoggedIn,
        mutate,
    };
};

export default useAuth;
