import { css } from "@emotion/react";
import { colors } from "@/config/theme";

export const table = css({
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: 0,
    tableLayout: "fixed",
});

export const th = css({
    padding: 10,
    borderBottom: `1px solid ${colors.grey300}`,
    borderRight: `1px solid ${colors.grey300}`,
    ":last-child": {
        borderRight: 0,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
    },
    ":first-of-type": {
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
    },
    cursor: 'pointer',
    fontWeight: 'bold',
    backgroundColor: colors.blue400,
    '&:hover': { 
        backgroundColor: '#e2e6ea' 
    }
});

export const td = css({
    padding: "5px 10px",
    borderBottom: `1px solid ${colors.grey300}`,
    borderRight: `1px solid ${colors.grey300}`,
    ":last-child": {
        borderRight: 0,
    },
});
