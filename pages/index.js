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

			<main>
				<h1>timebill</h1>
				<p className={styles.subtitle}>figure out how much ya gettin paid</p>

				<section>
					<label className={styles.rateForm}>
						<h2>hourly rate</h2>
						<div className={styles.rateInputRow}>
							<Input
								id="rateInput"
								type="number"
								value={rate}
								min={0}
								onChange={(e) => setRate(e.target.value)}
								onBlur={(e) => setRate(+e.target.value || 0)}
							/>
							<span className={styles.rateHintText}>
								(${(rate * 40 * 52).toLocaleString()} yearly,{" "}
								{formatCurrency(rate)}/hr &times; 40 hours/wk &times; 52
								weeks/yr)
							</span>
						</div>
					</label>
				</section>

				<section>
					<div className={styles.timeTable} role="table">
						<header role="rowgroup">
							<div role="row" className={styles.entryRow}>
								<div className={styles.noteCell} role="cell">
									note
								</div>
								<div className={styles.thinCell} role="cell">
									hours
								</div>
								<div className={styles.thinCell} role="cell">
									minutes
								</div>
								<div className={styles.thinCell} role="cell">
									seconds
								</div>
								<div className={styles.thinCell} role="cell">
									amount
								</div>
								<div className={styles.actionCell} role="cell">
									actions
								</div>
							</div>
						</header>
						<ul role="rowgroup">
							{timeEntries.map((entry, index) => (
								<li key={index} className={styles.entryRow} role="row">
									<div className={styles.noteCell} role="cell">
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
									<div className={styles.thinCell} role="cell">
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
									<div className={styles.thinCell} role="cell">
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
									<div className={styles.thinCell} role="cell">
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
									<div className={styles.thinCell} role="cell">
										{formatCurrency(timeToDecimal({ entry, rate }))}
									</div>
									<div className={styles.actionCell} role="cell">
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
							<li
								role="row"
								className={classNames(styles.entryRow, styles.totalRow)}
							>
								<div role="cell" className={styles.totalValue}>
									Total amount:{" "}
									{formatCurrency(timeToDecimal({ entry: totals, rate }))}
								</div>
							</li>
						</ul>
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
