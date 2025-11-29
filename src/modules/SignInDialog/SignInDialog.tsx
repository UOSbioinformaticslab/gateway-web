"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import MuiDialogActions from "@mui/material/DialogActions";
import MuiDialogContent from "@mui/material/DialogContent";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import InputWrapper from "@/components/InputWrapper";
import useDialog from "@/hooks/useDialog";
import useAuth from "@/hooks/useAuth";
import apis from "@/config/apis";
import notificationService from "@/services/notification";

const TRANSLATION_PATH = "modules.dialogs.SignInDialog";

interface SignInFormValues {
    email: string;
    password: string;
}

const SignInDialog = () => {
    const t = useTranslations(TRANSLATION_PATH);
    const { hideDialog, store } = useDialog();
    const { mutate: mutateAuth } = useAuth();
    const { push } = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const redirectPath = store?.dialogProps?.redirectPath;

    const validationSchema = yup.object({
        email: yup
            .string()
            .email(t("emailInvalid") || "Invalid email address")
            .required(t("emailRequired") || "Email is required"),
        password: yup
            .string()
            .required(t("passwordRequired") || "Password is required"),
    });

    const { control, handleSubmit } = useForm<SignInFormValues>({
        mode: "onTouched",
        resolver: yupResolver(validationSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const handleSignIn = async (values: SignInFormValues) => {
        setIsLoading(true);

        try {
            const response = await fetch(apis.loginInternalUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            let data;
            const contentType = response.headers.get("content-type");
            
            // Try to parse JSON, but handle non-JSON responses
            try {
                const text = await response.text();
                data = text ? JSON.parse(text) : {};
            } catch (parseError) {
                // If response is not JSON, create error response
                if (!response.ok) {
                    notificationService.error({
                        message: `Login failed: ${response.status} ${response.statusText}`,
                    });
                    setIsLoading(false);
                    return;
                }
                data = {};
            }

            if (!response.ok) {
                const errorMessage =
                    data.error ||
                    data.message ||
                    (data.debug?.response?.message
                        ? `Login failed: ${data.debug.response.message}`
                        : null) ||
                    t("loginFailed") ||
                    "Login failed";
                
                notificationService.error({
                    message: errorMessage,
                });
                setIsLoading(false);
                return;
            }

            // Refresh auth state
            await mutateAuth();

            notificationService.success({
                message: t("loginSuccess") || "Login successful",
            });

            hideDialog();

            // Redirect if provided
            if (redirectPath) {
                push(redirectPath);
            } else if (typeof store?.dialogProps?.onSuccess === "function") {
                store.dialogProps.onSuccess(data);
            }
        } catch (error) {
            const err = error as Error;
            console.error("Login error:", err);
            
            // Show more specific error message
            const errorMessage =
                err.message ||
                t("loginError") ||
                "An error occurred during login. Please try again.";
            
            notificationService.error({
                message: errorMessage,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog
            title={t("title")}
            onClose={() => hideDialog()}
            open={!!store?.dialogProps?.isSignInDialog}>
            <form onSubmit={handleSubmit(handleSignIn)}>
                <MuiDialogContent sx={{ paddingX: 8 }}>
                    <InputWrapper
                        component="TextField"
                        control={control}
                        label={t("emailLabel") || "Email"}
                        name="email"
                        type="email"
                        required
                    />
                    <InputWrapper
                        component="TextField"
                        control={control}
                        label={t("passwordLabel") || "Password"}
                        name="password"
                        type="password"
                        required
                    />
                </MuiDialogContent>
                <MuiDialogActions sx={{ paddingX: 8, paddingBottom: 4 }}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => hideDialog()}>
                        {t("cancelButton") || "Cancel"}
                    </Button>
                    <Button type="submit" isLoading={isLoading}>
                        {t("button") || "Sign in"}
                    </Button>
                </MuiDialogActions>
            </form>
        </Dialog>
    );
};

export default SignInDialog;

