/**
 * custom styled button component
 */

import classNames from "classnames";
import styles from "./button.module.css";

export const Button = ({ className, ...props }) => {
	return <button className={classNames(className, styles.button)} {...props} />;
};
