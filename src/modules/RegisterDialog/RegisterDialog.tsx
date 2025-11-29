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

const TRANSLATION_PATH = "modules.dialogs.RegisterDialog";

interface RegisterFormValues {
    email: string;
    password: string;
    passwordConfirm: string;
    firstname?: string;
    lastname?: string;
}

const RegisterDialog = () => {
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
            .min(8, t("passwordMinLength") || "Password must be at least 8 characters")
            .required(t("passwordRequired") || "Password is required"),
        passwordConfirm: yup
            .string()
            .oneOf(
                [yup.ref("password")],
                t("passwordMismatch") || "Passwords must match"
            )
            .required(t("passwordConfirmRequired") || "Please confirm your password"),
        firstname: yup.string(),
        lastname: yup.string(),
    });

    const { control, handleSubmit } = useForm<RegisterFormValues>({
        mode: "onTouched",
        resolver: yupResolver(validationSchema),
        defaultValues: {
            email: "",
            password: "",
            passwordConfirm: "",
            firstname: "",
            lastname: "",
        },
    });

    const handleRegister = async (values: RegisterFormValues) => {
        setIsLoading(true);

        try {
            const { passwordConfirm, ...registerData } = values;

            const response = await fetch(apis.registerInternalUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(registerData),
            });

            const data = await response.json();

            if (!response.ok) {
                notificationService.error({
                    message:
                        data.error ||
                        t("registerFailed") ||
                        "Registration failed",
                });
                setIsLoading(false);
                return;
            }

            // Refresh auth state
            await mutateAuth();

            notificationService.success({
                message:
                    t("registerSuccess") || "Registration successful",
            });

            hideDialog();

            // Redirect if provided
            if (redirectPath) {
                push(redirectPath);
            } else if (typeof store?.dialogProps?.onSuccess === "function") {
                store.dialogProps.onSuccess(data);
            }
        } catch (error) {
            notificationService.error({
                message:
                    t("registerError") ||
                    "An error occurred during registration. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog
            title={t("title") || "Create an account"}
            onClose={() => hideDialog()}
            open={!!store?.dialogProps?.isRegisterDialog}>
            <form onSubmit={handleSubmit(handleRegister)}>
                <MuiDialogContent sx={{ paddingX: 8 }}>
                    <InputWrapper
                        component="TextField"
                        control={control}
                        label={t("firstnameLabel") || "First name"}
                        name="firstname"
                    />
                    <InputWrapper
                        component="TextField"
                        control={control}
                        label={t("lastnameLabel") || "Last name"}
                        name="lastname"
                    />
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
                    <InputWrapper
                        component="TextField"
                        control={control}
                        label={t("passwordConfirmLabel") || "Confirm Password"}
                        name="passwordConfirm"
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
                        {t("button") || "Create account"}
                    </Button>
                </MuiDialogActions>
            </form>
        </Dialog>
    );
};

export default RegisterDialog;

