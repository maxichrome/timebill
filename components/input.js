/**
 * custom input component
 */

import classNames from "classnames";
import styles from "./input.module.css";

export const Input = ({ className, ...props }) => {
	return <input className={classNames(className, styles.input)} {...props} />;
};
