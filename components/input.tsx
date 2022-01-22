/**
 * custom input component
 */

import classNames from "classnames";
import React from "react";
import styles from "./input.module.css";

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = ({ className, ...props }) => {
	return <input className={classNames(className, styles.input)} {...props} />;
};
