import { AppProps } from "next/app";
import React from "react";
import "../styles/globals.css";

const TimebillApp: React.FC<AppProps> = ({ Component, pageProps }) => {
	return <Component {...pageProps} />;
};

export default TimebillApp;
