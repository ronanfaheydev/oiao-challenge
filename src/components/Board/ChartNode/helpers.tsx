export const colorMap: { [key: string]: string } = {};
export const getColor = (series_id: string) => {
	if (colorMap[series_id]) {
		return colorMap[series_id];
	}
	const color = generateColor(series_id);
	colorMap[series_id] = color;
	return color;
};

// generate hex colors from the series id
export const generateColor = (series_id: string) => {
	const color = `${series_id}666666`
		.split("")
		.map((char) => char.charCodeAt(0))
		.reduce((acc, charCode) => acc * charCode, 1);

	return `#${color.toString(16).slice(0, 6)}`;
};

export const formatObservationDate = (date: number) => {
	// yyyy-mm-dd
	return new Date(date).toISOString().split("T")[0];
};
