/**
 * maxichrome emblem component
 */

import styles from "./emblem.module.css";

export const MaxichromeEmblem = () => (
	<a
		className={styles.maxiemblem}
		href="https://maxichrome.dev"
		target="_blank"
		rel="noreferrer"
	>
		<img
			src="https://www.gravatar.com/avatar/227482d009acc069ec2b012a74096541?s=64&d=404"
			width="64"
			height="64"
			alt="a maxichrome project"
			title="a maxichrome project"
		/>
	</a>
);
