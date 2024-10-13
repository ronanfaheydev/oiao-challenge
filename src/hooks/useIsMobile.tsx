import { useEffect, useState } from "react";

export const getIsMobile = () => window.innerWidth < 768;

export const useIsMobile = () => {
	const [isMobile, setIsMobile] = useState<boolean>(false);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(getIsMobile());
		};

		handleResize();

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return isMobile;
};
