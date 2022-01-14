import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

const Money = ({ entry, rate }) => (
	<>
		$
		{Math.floor(
			((entry.seconds / 60 + entry.minutes) / 60 + entry.hours) * rate * 100
		) / 100}
	</>
);

export default function HomePage() {
	const [rate, setRate] = useState(0);
	const [timeEntries, setTimeEntries] = useState([
		{ hours: 0, minutes: 0, seconds: 0 },
	]);
	const [totals, setTotals] = useState({
		hours: 0,
		minutes: 0,
		seconds: 0,
	});

	const updateTimeEntry = useCallback(
		(index, newData) => {
			setTimeEntries((entries) =>
				entries.map((existingEntry, i) =>
					i === index ? { ...existingEntry, ...newData } : existingEntry
				)
			);
		},
		[setTimeEntries]
	);

	const saveLocalState = (empty = false) => {
		localStorage.setItem(
			"timeEntries",
			JSON.stringify(
				empty ? [{ hours: 0, minutes: 0, seconds: 0 }] : timeEntries
			)
		);
		localStorage.setItem("rate", JSON.stringify(empty ? 0 : rate));
	};

	useEffect(() => {
		// bring in local storage on initial mount
		const localTimeEntries = JSON.parse(localStorage.getItem("timeEntries"));
		const localRate = JSON.parse(localStorage.getItem("rate"));

		if (localTimeEntries) setTimeEntries(localTimeEntries);
		if (localRate) setRate(localRate);
	}, []);

	useEffect(() => {
		// calculate totals
		const newTotals = {
			hours: 0,
			minutes: 0,
			seconds: 0,
		};

		timeEntries.forEach((entry) => {
			newTotals.hours += entry.hours;
			newTotals.minutes += entry.minutes;
			newTotals.seconds += entry.seconds;
		});

		setTotals(newTotals);
	}, [timeEntries]);

	return (
		<div>
			<Head>
				<title>time bill calculator</title>
			</Head>

			<main>
				<h1>time bill calculator</h1>

				<hr />

				<button onClick={() => saveLocalState()}>save</button>
				<button
					onClick={() =>
						setTimeEntries((entries) =>
							entries.map(() => ({ hours: 0, minutes: 0, seconds: 0 }))
						)
					}
				>
					clear
				</button>
				<button
					onClick={() => {
						if (
							!confirm(
								"this will permanently clear your saved data. are you sure?"
							)
						)
							return;

						setTimeEntries([{ hours: 0, minutes: 0, seconds: 0 }]);
						setRate(0);

						saveLocalState(true);
					}}
				>
					reset
				</button>

				<hr />

				<label htmlFor="rateInput">hourly rate</label>
				<br />
				<input
					id="rateInput"
					type="number"
					value={rate}
					min={0}
					onChange={(e) => setRate(+e.target.value)}
				/>

				<hr />

				<table className={styles.timeTable}>
					<thead>
						<tr>
							<th>hours</th>
							<th>minutes</th>
							<th>seconds</th>
							<th>billable</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{timeEntries.map((entry, index) => (
							<tr key={index}>
								<td>
									<input
										type="number"
										value={entry.hours}
										min={0}
										onChange={(e) => {
											updateTimeEntry(index, { hours: +e.target.value || "" });
										}}
										onBlur={(e) => {
											if (!entry.hours) updateTimeEntry(index, { hours: 0 });
										}}
									/>
								</td>
								<td>
									<input
										type="number"
										value={entry.minutes}
										min={0}
										max={59}
										onChange={(e) => {
											updateTimeEntry(index, {
												minutes: +e.target.value || "",
											});
										}}
										onBlur={(e) => {
											if (!entry.minutes)
												updateTimeEntry(index, { minutes: 0 });
										}}
									/>
								</td>
								<td>
									<input
										type="number"
										value={entry.seconds}
										min={0}
										max={59}
										onChange={(e) => {
											updateTimeEntry(index, {
												seconds: +e.target.value || "",
											});
										}}
										onBlur={(e) => {
											if (!entry.seconds)
												updateTimeEntry(index, { seconds: 0 });
										}}
									/>
								</td>
								<td>
									<Money entry={entry} rate={rate} />
								</td>
								<td>
									<button
										disabled={index === 0}
										onClick={() => {
											setTimeEntries((entries) =>
												entries.filter((_, i) => i !== index)
											);
										}}
									>
										-
									</button>
									<button
										onClick={() => {
											setTimeEntries((entries) =>
												[
													...entries.slice(0, index + 1),
													{
														hours: Math.floor(Math.random() * 50),
														minutes: 0,
														seconds: 0,
													},
													...entries.slice(index + 1),
												].flat()
											);
										}}
									>
										+
									</button>
								</td>
							</tr>
						))}
						<tr className={styles.totalHeadingRow}>
							<th></th>
							<th></th>
							<th></th>
							<th>total</th>
							<th></th>
						</tr>
						<tr className={styles.totalRow}>
							<td>{totals.hours}h</td>
							<td>{totals.minutes}m</td>
							<td>{totals.seconds}s</td>
							<td className={styles.totalValue}>
								<Money entry={totals} rate={rate} />
							</td>
							<td />
						</tr>
					</tbody>
				</table>
			</main>

			<footer>
				<hr />
				<p>
					made by{" "}
					<a href="https://maxichrome.dev" target="blank">
						maxichrome
					</a>
				</p>
			</footer>
		</div>
	);
}
