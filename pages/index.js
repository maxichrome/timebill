import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../components/button";
import { MaxichromeEmblem } from "../components/emblem";
import { Input } from "../components/input";
import styles from "../styles/Home.module.css";

const MoneyText = ({ entry, rate }) => {
	const valueInHundredths = Math.floor(
		((entry.seconds / 60 + entry.minutes) / 60 + entry.hours) * rate * 100
	);

	return (
		<>
			${Math.floor(valueInHundredths / 100)}.
			{(valueInHundredths % 100).toString().padStart(2, "0")}
		</>
	);
};

export default function HomePage() {
	const [rate, setRate] = useState(0);
	const [timeEntries, setTimeEntries] = useState([
		{ hours: 0, minutes: 0, seconds: 0 },
	]);
	const [totals, setTotals] = useState({
		hours: 0,
		minutes: 0,
		seconds: 0,
		decimal: 0,
	});

	const [saveText, setSaveText] = useState("save");

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

		setSaveText("saved!");

		setTimeout(() => {
			setSaveText("save");
		}, 3000);
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
			decimal: 0,
		};

		timeEntries.forEach((entry) => {
			newTotals.hours += entry.hours;
			newTotals.minutes += entry.minutes;
			newTotals.seconds += entry.seconds;
			newTotals.decimal +=
				(entry.seconds / 60 + entry.minutes) / 60 + entry.hours;
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
				<p className={styles.subtitle}>figure out how much ya gettin paid</p>

				<section>
					<label className={styles.rateForm}>
						<h2>hourly rate</h2>
						<Input
							id="rateInput"
							type="number"
							value={rate}
							min={0}
							onChange={(e) => setRate(+e.target.value)}
						/>
					</label>
				</section>

				<section>
					<div className={styles.timeTable} role="table">
						<header role="rowgroup">
							<div role="row">
								<th>hours</th>
								<th>minutes</th>
								<th>seconds</th>
								<th>amount</th>
								<th></th>
							</div>
						</header>
						<ul role="rowgroup">
							{timeEntries.map((entry, index) => (
								<tr key={index}>
									<td>
										<Input
											type="number"
											value={entry.hours}
											min={0}
											onChange={(e) => {
												updateTimeEntry(index, {
													hours: +e.target.value || "",
												});
											}}
											onBlur={(e) => {
												if (!entry.hours) updateTimeEntry(index, { hours: 0 });
											}}
										/>
									</td>
									<td>
										<Input
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
										<Input
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
										<MoneyText entry={entry} rate={rate} />
									</td>
									<td>
										<Button
											disabled={timeEntries.length <= 1}
											onClick={() => {
												setTimeEntries((entries) =>
													entries.filter((_, i) => i !== index)
												);
											}}
										>
											-
										</Button>
										<Button
											onClick={() => {
												setTimeEntries((entries) =>
													[
														...entries.slice(0, index + 1),
														{
															hours: 0,
															minutes: 0,
															seconds: 0,
														},
														...entries.slice(index + 1),
													].flat()
												);
											}}
										>
											+
										</Button>
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
									<MoneyText entry={totals} rate={rate} />
								</td>
								<td>{Math.floor(totals.decimal * 10000) / 10000}h</td>
							</tr>
						</ul>
					</div>

					<Button
						onClick={() =>
							setTimeEntries((entries) =>
								entries.map(() => ({ hours: 0, minutes: 0, seconds: 0 }))
							)
						}
					>
						clear entries
					</Button>
				</section>
			</main>

			<footer>
				<hr />
				<p>
					<small>
						<a
							href="https://github.com/maxichrome/bill"
							target="_blank"
							rel="noreferrer"
						>
							source code
						</a>
					</small>
				</p>

				<MaxichromeEmblem />
			</footer>
		</div>
	);
}
