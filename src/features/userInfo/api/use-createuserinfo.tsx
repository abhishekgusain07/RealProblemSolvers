'use client'
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCallback, useMemo, useState } from "react";
import type { Id } from "../../../../convex/_generated/dataModel";
import type { userProffesion } from "@/lib/types";

type RequestType = {
    userName : string;
    github: string;
    linkedin ?: string;
    lastProject ?: string;
    currentWork ?: string;
    profession : userProffesion;
    institution ?: string;
    skills: string[];
    photoId ?: Id<"_storage"> | undefined;
    lastActive ?: number;
};
type ResponseType = Id <"userInfo"> | null;

type Options = {
    onSuccess?: (data: ResponseType) => void;
    onError?: (error: Error) => void;
    onSettled?: () => void;
    throwError?: boolean;
}
export const useCreateUserInfo = (options?: Options) => {
    const [data, setData] = useState<ResponseType>(null);
    const [error, setError] = useState<Error | null>(null);
    const [status, setStatus] = useState<null | "pending" | "success" | "error" | "settled">(null);

    const isPending = useMemo(() => status === "pending", [status]);
    const isSuccess = useMemo(() => status === "success", [status]);
    const isError = useMemo(() => status === "error", [status]);
    const isSettled = useMemo(() => status === "settled", [status]);

    const mutation = useMutation(api.userInfo.create);

    const mutate = useCallback(async(values:RequestType, options?: Options) => {
        try {
            setData(null);
            setError(null);
            setStatus("pending");
            const response = await mutation(values);
            options?.onSuccess?.(response);
            return response
        } catch (error) {
            setStatus("error");
            options?.onError?.(error as Error);
            if(options?.throwError){
                throw error;
            }
        } finally {
            setStatus("settled");
            options?.onSettled?.();
        }
    },[mutation])
    
    return {
        mutate,
        data,
        error,
        isPending,
        isSuccess,
        isError,
        isSettled
    }
}