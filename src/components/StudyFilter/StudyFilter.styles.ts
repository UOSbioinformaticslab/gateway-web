import styled from "@emotion/styled";
import Box from "../Box";
import Typography from "../Typography";

export const SectionHeading = styled('h3')(() => ({
    fontFamily: 'Poppins,sans-serif',
    fontSize: "2.2em", 
    marginTop: "40px",
    marginBottom: "20px",
    textAlign: "center",
    fontWeight: 800,
    textShadow: "1px 1px 3px rgba(0, 0, 0, 0.1)"
}));

export const IntroText = styled('p')(() => ({
    fontSize: "1.2em",
    lineHeight: 1.6,
    maxWidth: "800px",
    margin: "0 auto",
    textAlign: "center",
    color: "#555",
}));