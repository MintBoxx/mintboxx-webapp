import { container, title } from "/styles/jss/nextjs-material-kit.js";

const quickMintPageStyle = {
  container: {
    zIndex: "12",
    color: "#FFFFFF",
    marginTop: "-80px",
    ...container
  },
  form: {
    marginTop: "-80px",
  },
  title: {
    ...title,
    display: "inline-block",
    position: "relative",
    marginTop: "30px",
    minHeight: "32px",
    color: "#FFFFFF",
    textDecoration: "none"
  },
  bottomTitle : {
    ...title,
    display: "inline-block",
    position: "relative",
    color: "black",
    fontSize: "1.313rem",
    textDecoration: "none",
    marginLeft:"30%"
  },
  subtitle: {
    fontSize: "1.313rem",
    maxWidth: "500px",
    margin: "10px auto 0"
  },
  main: {
    background: "#FFFFFF",
    position: "relative",
    zIndex: "3"
  },
  mainRaised: {
    margin: "-60px 30px 0px",
    borderRadius: "6px",
    boxShadow:
      "0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)"
  }
};

export default quickMintPageStyle;
