import { Clear } from "@mui/icons-material";
import {
	Autocomplete,
	Button,
	Card,
	CardContent,
	CardHeader,
	CircularProgress,
	FormControl,
	FormControlLabel,
	FormHelperText,
	Input,
	InputLabel,
	Radio,
	RadioGroup,
	TextField,
	Typography,
} from "@mui/material";
import { Handle, Position } from "@xyflow/react";
import { useCallback, useContext, useState } from "react";
import styled from "styled-components";
import { useGetSeriesSearch, type SeriesSearchData } from "../../../queries";
import ErrorBoundary from "../../ErrorBoundary";
import { getColor } from "../ChartNode/helpers";
import BoardContext from "../context";

const StyledCard = styled(Card)`
	min-width: 320px;
	overflow: visible;
	.Mui-CardHeader-root {
		max-width: 300px;
	}
	.MuiCardContent-root {
		overflow: visible;
	}
	.MuiTypography-body1 {
		max-width: 300px;
	}
`;

const StyledHandle = styled(Handle)<{ $isOn: boolean }>`
	background-color: ${({ $isOn }) => ($isOn ? "#ffa705" : "white")};
	border: 2px solid ${({ $isOn }) => ($isOn ? "#ffa705" : "lightgray")};
	border-radius: 5px;
	margin: auto;

	height: 50px;
	width: 20px;
	margin-right: -5px;

	@media (min-width: 768px) {
		height: 50px;
		width: 20px;
	}
`;

interface DataSourceNodeProps {
	id: string;
}

function DataSourceNode({ id }: DataSourceNodeProps) {
	const [selectedSeries, setSelectedSeries] = useState<
		| (SeriesSearchData & {
				color?: string;
				chartType: string;
				lineStyle: string;
				barStyle: string;
		  })
		| null
	>(null);
	const [searchText, setSearchText] = useState("");

	const {
		data: seriesSearch,
		isLoading: seriesLoading,
		isFetched: seriesSearchFetched,
		error: seriesSearchError,
	} = useGetSeriesSearch(
		{
			search_text: searchText,
		},
		{
			query: { enabled: searchText.length > 2 },
		} as any
	);

	const { updateNode } = useContext(BoardContext);

	const onChange = useCallback(
		(value: SeriesSearchData) => {
			const series = {
				...value,
				color: getColor(value.id),
				chartType: "line",
				lineStyle: "solid",
				barStyle: "solid",
			};
			setSelectedSeries(series);
			updateNode(id, { series, isReady: true });
		},
		[id, updateNode]
	);

	const setColor = useCallback(
		(color: string) => {
			if (selectedSeries) {
				updateNode(id, { series: { ...selectedSeries, color }, isReady: true });
			}
			setSelectedSeries(selectedSeries ? { ...selectedSeries, color } : null);
		},
		[id, selectedSeries, updateNode]
	);

	const onCardClear = useCallback(() => {
		setSelectedSeries(null);
		updateNode(id, { series: null, isReady: false });
	}, [id, updateNode]);

	const onChartTypeChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			if (selectedSeries) {
				updateNode(id, {
					series: { ...selectedSeries, chartType: e.target.value },
				});
				setSelectedSeries({ ...selectedSeries, chartType: e.target.value });
			}
		},
		[id, selectedSeries, updateNode]
	);

	if (seriesSearchError) {
		throw seriesSearchError;
	}

	return (
		<>
			<StyledHandle
				type="source"
				position={Position.Right}
				$isOn={!!selectedSeries}
				isConnectable={!!selectedSeries}
			/>
			<StyledCard>
				<CardHeader
					title={selectedSeries ? <>{selectedSeries.id}</> : "New data source"}
					action={
						selectedSeries ? (
							<Button variant="outlined" color="error" onClick={onCardClear}>
								<Clear />
							</Button>
						) : seriesLoading ? (
							<CircularProgress color="inherit" size={20} />
						) : null
					}
				/>
				<CardContent>
					{selectedSeries ? (
						<div>
							<Typography component="p">{selectedSeries.title}</Typography>
							<p>{selectedSeries.frequency}</p>

							<FormControl>
								<RadioGroup
									value={selectedSeries.chartType}
									onChange={onChartTypeChange}
									row
									defaultValue="line"
									name="chart-type"
								>
									<FormControlLabel
										value="line"
										control={<Radio />}
										label="Line"
									/>
									<FormControlLabel
										value="bar"
										control={<Radio />}
										label="Bar"
									/>
								</RadioGroup>
							</FormControl>
							<br />
							{selectedSeries.chartType === "line" ? (
								<FormControl>
									<RadioGroup
										value={selectedSeries.lineStyle}
										onChange={(e) => {
											updateNode(id, {
												series: {
													...selectedSeries,
													lineStyle: e.target.value,
												},
											});
											setSelectedSeries({
												...selectedSeries,
												lineStyle: e.target.value,
											});
										}}
										row
										defaultValue="solid"
										name="line-style"
									>
										<FormControlLabel
											value="solid"
											control={<Radio />}
											label="Solid"
										/>
										<FormControlLabel
											value="dashed"
											control={<Radio />}
											label="Dashed"
										/>
										<FormControlLabel
											value="dotted"
											control={<Radio />}
											label="Dotted"
										/>
									</RadioGroup>
								</FormControl>
							) : (
								<FormControl>
									<RadioGroup
										value={selectedSeries.barStyle}
										onChange={(e) => {
											updateNode(id, {
												series: { ...selectedSeries, barStyle: e.target.value },
											});
											setSelectedSeries({
												...selectedSeries,
												barStyle: e.target.value,
											});
										}}
										row
										defaultValue="solid"
										name="bar-style"
									>
										<FormControlLabel
											value="solid"
											control={<Radio />}
											label="Solid"
										/>
										<FormControlLabel
											value="outlined"
											control={<Radio />}
											label="Outlined"
										/>
									</RadioGroup>
								</FormControl>
							)}

							<Input
								style={{ display: "block", width: "100%" }}
								type="color"
								value={selectedSeries.color}
								onChange={(e) => {
									setColor(e.target.value);
								}}
							/>
						</div>
					) : (
						<>
							<Autocomplete
								freeSolo
								options={seriesSearch?.seriess || []}
								getOptionLabel={(option: any) =>
									`${option.title} (${option.units_short}) - ${option.id}`
								}
								isOptionEqualToValue={(option, value) => option.id === value.id}
								renderInput={(params) => (
									<>
										<InputLabel htmlFor={`${id}-search`}>
											{seriesSearchFetched
												? `Search for a data series (${seriesSearch?.count} results)`
												: "Search for a data series"}
										</InputLabel>
										<TextField
											variant="outlined"
											{...params}
											id={`${id}-search`}
											placeholder="e.g. CPI or GDP..."
											onChange={(evt) => {
												setSearchText(evt.target.value);
											}}
											type="outlined"
										/>
										<FormHelperText>
											Search for a data series by name or ID
										</FormHelperText>
									</>
								)}
								onChange={(_, value) => {
									onChange(value);
								}}
							/>
						</>
					)}
				</CardContent>
			</StyledCard>
		</>
	);
}

export default (props: DataSourceNodeProps) => {
	return (
		<ErrorBoundary type="DataSource" message="Error loading data source">
			<DataSourceNode {...props} />
		</ErrorBoundary>
	);
};
