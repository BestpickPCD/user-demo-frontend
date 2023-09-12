import { FC, ReactNode } from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";

interface LabelProps {
  className?: string;
  color?:
    | "primary"
    | "black"
    | "secondary"
    | "error"
    | "warning"
    | "success"
    | "info";
  children?: ReactNode;
}

const Label: FC<LabelProps> = ({ color = "secondary", children, ...rest }) => (
  <span {...rest}>{children}</span>
);

Label.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  color: PropTypes.oneOf([
    "primary",
    "black",
    "secondary",
    "error",
    "warning",
    "success",
    "info",
  ]),
};

export default Label;
