import { ReactNode } from "react";
import metaData from "@/utils/metadata";

export const metadata = metaData({
    title: "CRUK DATA HUB",
    isDefault: true,
    description: "CRUK DATA HUB is temporarily unavailable for maintenance.",
});

export default async function RootLayout(props: {
    params: Promise<{ locale: string }>;
    children: ReactNode;
}) {
    const { locale } = await props.params;

    return (
        <html lang={locale}>
            <body
                style={{
                    margin: 0,
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily:
                        "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
                    background: "#f4f6f8",
                    color: "#29235C",
                }}>
                <main
                    style={{
                        textAlign: "center",
                        padding: "2rem",
                        maxWidth: 560,
                    }}>
                    <p
                        style={{
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            fontSize: 14,
                            marginBottom: 12,
                        }}>
                        CRUK DATA HUB
                    </p>
                    <h1 style={{ fontSize: "2rem", margin: "0 0 1rem" }}>
                        Under maintenance
                    </h1>
                    <p
                        style={{
                            fontSize: "1.125rem",
                            lineHeight: 1.5,
                            margin: 0,
                        }}>
                        We are carrying out scheduled maintenance. Please check
                        back shortly.
                    </p>
                </main>
            </body>
        </html>
    );
}
