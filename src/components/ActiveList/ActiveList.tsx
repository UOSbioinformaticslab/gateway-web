import { SvgIconComponent } from "@mui/icons-material";
import { Typography } from "@mui/material";
import Button from "@/components/Button";
import { colourType } from "@/config/theme";
import { CircleIcon } from "@/consts/icons";

interface ActiveListProps {
    items: { label: string }[];
    icon?: SvgIconComponent;
    iconColour?: colourType;
    activeItem: number;
    handleClick: (id: number) => void;
    variant?: "default" | "sidebar";
}

const ActiveList = ({
    items,
    icon,
    handleClick,
    activeItem = 1,
    iconColour = "primary",
    variant = "default",
}: ActiveListProps) => {
    const Icon = icon || CircleIcon;
    return (
        <ul
            style={{
                gap: variant === "sidebar" ? 2 : 8,
                display: "flex",
                flexDirection: "column",
                listStyle: "none",
                padding: 0,
            }}>
            {items.map((item, index) => {
                const isActive = activeItem === index + 1;
                return (
                    <li
                        key={item.label}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: variant === "sidebar" ? 0 : 5,
                        }}>
                        <Button
                            onClick={() => handleClick(index + 1)}
                            variant="link"
                            sx={{
                                whiteSpace: "inherit",
                                textAlign: "left",
                                width: "100%",
                                justifyContent: "flex-start",
                                ...(variant === "sidebar"
                                    ? {
                                          px: 1.5,
                                          py: 0.85,
                                          borderRadius: 1,
                                          color: isActive
                                              ? "primary.main"
                                              : "text.primary",
                                          backgroundColor: isActive
                                              ? "rgba(0, 70, 140, 0.08)"
                                              : "transparent",
                                          "&:hover": {
                                              backgroundColor: isActive
                                                  ? "rgba(0, 70, 140, 0.12)"
                                                  : "rgba(0, 0, 0, 0.04)",
                                          },
                                      }
                                    : {}),
                            }}
                            startIcon={
                                variant === "sidebar" ? undefined : (
                                    <Icon
                                        color={iconColour}
                                        sx={{
                                            opacity: isActive ? 1 : 0.3,
                                        }}
                                    />
                                )
                            }>
                            <Typography fontSize="14" sx={{ width: "100%" }}>
                                {item.label}
                            </Typography>
                        </Button>
                    </li>
                );
            })}
        </ul>
    );
};

export default ActiveList;
