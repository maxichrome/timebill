/**
 * custom styled button component
 */

import classNames from "classnames";
import React from "react";
import styles from "./button.module.css";

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button: React.FC<ButtonProps> = ({ className, ...props }) => {
	return <button className={classNames(className, styles.button)} {...props} />;
};
