import classNames from "classnames";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../components/button";
import { MaxichromeEmblem } from "../components/emblem";
import { Input } from "../components/input";
import styles from "../styles/Home.module.css";

const EMPTY_TIME_ENTRY = {
	note: "",
	hours: 0,
	minutes: 0,
	seconds: 0,
};

const timeToDecimal = ({ entry, rate }) =>
	((entry.seconds / 60 + entry.minutes) / 60 + entry.hours) * rate;

// TODO: consider moving this to a builtin solution like toLocaleString with options?
const formatCurrency = (value) => {
	const valueInHundredths = Math.floor(value * 100);

	return (
		`$${Math.floor((valueInHundredths || 0) / 100).toLocaleString()}` +
		`.${((valueInHundredths || 0) % 100).toString().padStart(2, "0")}`
	);
};

export default function HomePage() {
	const [rate, setRate] = useState(0);
	const [timeEntries, setTimeEntries] = useState([EMPTY_TIME_ENTRY]);
	const [totals, setTotals] = useState({
		hours: 0,
		minutes: 0,
		seconds: 0,
		decimal: 0,
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

	const saveLocalState = useCallback(
		(empty = false) => {
			localStorage.setItem(
				"timeEntries",
				JSON.stringify(empty ? [EMPTY_TIME_ENTRY] : timeEntries)
			);
			localStorage.setItem("rate", JSON.stringify(empty ? 0 : rate));
		},
		[rate, timeEntries]
	);

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

	useEffect(() => {
		saveLocalState();
	}, [saveLocalState, timeEntries, rate]);

	return (
		<div>
			<Head>
				<title>timebill</title>
			</Head>

			<header>
				<h1>timebill</h1>
				<p className={styles.subtitle}>figure out how much ya gettin paid</p>
			</header>

			<main>
				<section aria-labelledby="hourlyRate_header">
					<label className={styles.rateForm}>
						<h2 id="hourlyRate_header">hourly rate</h2>
						<div className={styles.rateInputRow}>
							<Input
								id="rateInput"
								type="number"
								value={rate}
								min={0}
								onChange={(e) => setRate(e.target.valueAsNumber)}
								onBlur={(e) => setRate(+e.target.value || 0)}
							/>
							<span className={styles.rateHintText}>
								{formatCurrency(rate)}/hr &times; 40 hours/wk &times; 52
								weeks/yr = ${(rate * 40 * 52).toLocaleString()} yearly
							</span>
						</div>
					</label>
				</section>

				<section aria-label="Time entries">
					<div className={styles.timeTable} role="table">
						<header role="rowgroup">
							<div role="row" className={styles.entryRow}>
								<div
									id="rowHeader_note"
									className={styles.noteCell}
									role="columnheader"
								>
									note
								</div>
								<div
									id="rowHeader_hours"
									className={styles.thinCell}
									role="columnheader"
								>
									hours
								</div>
								<div
									id="rowHeader_minutes"
									className={styles.thinCell}
									role="columnheader"
								>
									minutes
								</div>
								<div
									id="rowHeader_seconds"
									className={styles.thinCell}
									role="columnheader"
								>
									seconds
								</div>
								<div
									id="rowHeader_amount"
									className={styles.thinCell}
									role="columnheader"
								>
									amount
								</div>
								<div
									id="rowHeader_actions"
									className={styles.actionCell}
									role="columnheader"
								>
									actions
								</div>
							</div>
						</header>
						<ul role="rowgroup">
							{timeEntries.map((entry, index) => (
								<li key={index} className={styles.entryRow} role="row">
									<div
										className={styles.noteCell}
										role="cell"
										aria-labelledby="rowHeader_note"
									>
										<Input
											type="text"
											value={entry.note}
											placeholder="enter a note here"
											onChange={(e) => {
												updateTimeEntry(index, {
													note: e.target.value,
												});
											}}
										/>
									</div>
									<div
										className={styles.thinCell}
										role="cell"
										aria-labelledby="rowHeader_hours"
									>
										<Input
											type="number"
											placeholder="hours"
											value={entry.hours}
											min={0}
											onChange={(e) => {
												updateTimeEntry(index, {
													hours: +e.target.value || "",
												});
											}}
											onBlur={(e) => {
												if (!entry.hours)
													updateTimeEntry(index, {
														hours: 0,
													});
											}}
										/>
									</div>
									<div
										className={styles.thinCell}
										role="cell"
										aria-labelledby="rowHeader_minutes"
									>
										<Input
											type="number"
											placeholder="minutes"
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
									</div>
									<div
										className={styles.thinCell}
										role="cell"
										aria-labelledby="rowHeader_seconds"
									>
										<Input
											type="number"
											placeholder="seconds"
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
									</div>
									<div
										className={styles.thinCell}
										role="cell"
										aria-labelledby="rowHeader_amount"
									>
										{formatCurrency(timeToDecimal({ entry, rate }))}
									</div>
									<div
										className={styles.actionCell}
										role="cell"
										aria-labelledby="rowHeader_actions"
									>
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
														EMPTY_TIME_ENTRY,
														...entries.slice(index + 1),
													].flat()
												);
											}}
										>
											+
										</Button>
									</div>
								</li>
							))}
						</ul>
						<section
							aria-label="Totals"
							role="row"
							className={classNames(styles.entryRow, styles.totalRow)}
						>
							<div role="cell" className={styles.totalValue}>
								Total amount:{" "}
								{formatCurrency(timeToDecimal({ entry: totals, rate }))}
							</div>
						</section>
					</div>

					<Button
						onClick={() =>
							confirm("want to clear all entry data? this is irreversible.") &&
							confirm(
								"double checking -- your data will NOT be recoverable! erase all time entries?"
							) &&
							setTimeEntries((entries) => entries.map(() => EMPTY_TIME_ENTRY))
						}
					>
						clear entries
					</Button>
				</section>
			</main>

			<footer>
				<p>
					<small>
						<a
							href="https://github.com/maxichrome/bill"
							target="_blank"
							rel="noreferrer"
						>
							github
						</a>
					</small>
				</p>

				<MaxichromeEmblem />
			</footer>
		</div>
	);
}
