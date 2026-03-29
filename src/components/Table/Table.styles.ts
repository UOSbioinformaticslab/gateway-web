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
    position: 'sticky',
    top: 0,
    zIndex: 1,
    '&:hover': { 
        backgroundColor: '#e2e6ea' 
    }
});

export const td = css({
    padding: "8px 12px",
    fontSize: "1rem",
    borderBottom: `1px solid ${colors.grey300}`,
    borderRight: `1px solid ${colors.grey300}`,
    ":last-child": {
        borderRight: 0,
    },
});

/** Data row cells — white band with comfortable padding (search results table). */
export const tdDataBand = css({
    padding: "14px 16px",
    verticalAlign: "middle",
    borderBottom: `1px solid ${colors.grey300}`,
    borderRight: `1px solid ${colors.grey300}`,
    color: colors.grey900,
    fontSize: "1.0625rem",
    ":last-child": {
        borderRight: 0,
    },
});
