import { Edit } from "@mui/icons-material";
import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	CircularProgress,
	FormGroup,
	Modal,
	TextField,
	Typography,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
	Bar,
	CartesianGrid,
	ComposedChart,
	Label,
	Legend,
	Line,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import styled from "styled-components";
import { chartHeaderHeight, chartHeight, chartWidth } from "./constants";

export interface ChartSeries {
	name: string;
	data: { y: number; x: number; seriesId: string }[];
	color: string;
	min: number;
	max: number;
	minDate: number;
	maxDate: number;
	chartType: "line" | "bar";
	lineStyle: "solid" | "dotted" | "dashed";
	barStyle: "solid" | "outlined";
}
export type DateRange = {
	datestart: number;
	dateend: number;
};
export interface ChartProps {
	data: ChartSeries[];
	id: string;
	isLoading: boolean;
	onDateChange: (dates: DateRange) => void;
}

const lineChartProps = {
	top: 5,
	right: 30,
	left: 20,
	bottom: 5,
};

const ChartContainer = styled(Card)`
	position: relative;
`;
const Loading = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
`;

const StyledFormGroup = styled(FormGroup)`
	justify-content: center;
	padding: 5px;
	gap: 10px;
`;

const TooltipContainer = styled.div`
	background-color: white;
	border: 1px solid lightgray;
	padding: 5px;
	border-radius: 5px;
`;

const ChartHeader = styled.div`
	display: flex;
	justify-content: space-around;
	align-items: center;
	flex-direction: column;
	height: ${chartHeaderHeight}px;
	padding: 5px 10px;
`;

const ChartInputs = styled.div`
	display: flex;
	justify-content: flex-end;
	align-items: center;
	width: 100%;
`;

const ChartContent = styled(CardContent)`
	min-height: calc(100% - ${chartHeaderHeight + 20}px);
	min-width: ${chartWidth}px;
	padding: 0;
`;

const getStrokeDashArray = (lineStyle: string) => {
	switch (lineStyle) {
		case "dotted":
			return "2 2";
		case "dashed":
			return "5 5";
		default:
			return "0";
	}
};

export const Chart = ({ data, id, isLoading, onDateChange }: ChartProps) => {
	const _minDate = useMemo(
		() => data.length && Math.min(...data.map((s) => s.minDate)),
		[data]
	);
	const _maxDate = useMemo(
		() => data.length && Math.max(0, ...data.map((s) => s.maxDate)),
		[data]
	);
	const [dates, setDates] = useState<DateRange>({
		datestart: _minDate,
		dateend: _maxDate,
	});

	useEffect(() => {
		if (_minDate && _maxDate) {
			setDates({ datestart: _minDate, dateend: _maxDate });
		}
	}, [_minDate, _maxDate]);

	const _onDateChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const date = new Date(e.target.value).getTime();
			let _dates = { ...dates, [e.target.name]: date };
			setDates(_dates);
			onDateChange(_dates);
		},
		[dates, onDateChange]
	);

	const [isEditing, setIsEditing] = useState(false);
	const handleClose = useCallback(() => setIsEditing(false), []);
	const handleEdit = useCallback(() => setIsEditing(true), []);

	const [yAxisTitles, setYAxisTitles] = useState<Record<string, string>>({});
	const [title, setTitle] = useState("New Chart");
	const [xAxisTitle, setXAxisTitle] = useState("Date");

	useEffect(() => {
		if (data.length) {
			const titles = data.reduce(
				(acc, s) => {
					acc[s.name] = s.name;
					return acc;
				},
				{} as Record<string, string>
			);
			setYAxisTitles((t) => {
				return { ...titles, ...t };
			});
		}
	}, [data]);

	const style = {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: 400,
		boxShadow: 24,
	};

	console.log(data);

	return (
		<>
			<Modal open={isEditing} onClose={handleClose}>
				<Box sx={style}>
					<Card>
						<CardHeader title="Edit Chart Text" />
						<CardContent>
							<FormGroup>
								<TextField
									label="Title"
									defaultValue={title}
									onChange={(e) => setTitle(e.target.value)}
								/>
								<TextField
									label="X Axis"
									defaultValue={xAxisTitle}
									onChange={(e) => setXAxisTitle(e.target.value)}
								/>
								<StyledFormGroup>
									{data.map((s, i) => (
										<TextField
											key={`yAxis-${s.name}-${id}`}
											label={`Y Axis ${i + 1}`}
											defaultValue={yAxisTitles[s.name]}
											onChange={(e) =>
												setYAxisTitles((t) => ({
													...t,
													[s.name]: e.target.value,
												}))
											}
										/>
									))}
								</StyledFormGroup>
							</FormGroup>
						</CardContent>
						<CardActions>
							<Button onClick={handleClose}>Save</Button>
						</CardActions>
					</Card>
				</Box>
			</Modal>
			<ChartContainer data-testid="chart-container">
				{isLoading && (
					<Loading>
						<CircularProgress />
					</Loading>
				)}
				<ChartHeader>
					<Typography variant="h6" component="h6">
						{title || "New Chart"}
						<Button onClick={handleEdit}>
							<Edit />
						</Button>
					</Typography>

					<ChartInputs>
						<StyledFormGroup row>
							<TextField
								id={`${id}-datestart`}
								name="datestart"
								type="date"
								helperText="Start Date"
								value={new Date(dates.datestart).toISOString().split("T")[0]}
								onChange={_onDateChange}
							/>
							<TextField
								id={`${id}-dateend`}
								name="dateend"
								type="date"
								helperText="End Date"
								value={new Date(dates.dateend).toISOString().split("T")[0]}
								onChange={_onDateChange}
							/>
						</StyledFormGroup>
					</ChartInputs>
				</ChartHeader>

				<ChartContent>
					<ResponsiveContainer
						width="100%"
						height="100%"
						minHeight={chartHeight}
						minWidth={chartWidth}
					>
						<ComposedChart margin={lineChartProps} data={data}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis
								scale="time"
								type="number"
								tickFormatter={(tick) => {
									const date = new Date(tick);
									return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
								}}
								dataKey="x"
								domain={[_minDate, _maxDate]}
								allowDuplicatedCategory={false}
								label={
									<Label value={xAxisTitle} angle={0} position="insideBottom" />
								}
							/>
							<Tooltip
								labelFormatter={(label) => {
									const date = new Date(label);
									return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
								}}
								content={(props) => {
									const { payload } = props;
									if (payload?.length) {
										const date = new Date(payload[0].payload.x);
										return (
											<TooltipContainer>
												<small>{`${date.toISOString().split("T")[0]}`}</small>
												{payload.map((p, i) => (
													<div
														key={i}
														style={{ color: p.color }}
													>{`${p.payload.seriesId}: ${Number(p.value).toFixed(2)}`}</div>
												))}
											</TooltipContainer>
										);
									}
									return null;
								}}
								cursor={{ strokeDasharray: "3 3" }}
							/>
							<Legend />

							{data?.map((s, i) => (
								<>
									<YAxis
										key={`yAxis-${s.name}-${id}`}
										dataKey="y"
										yAxisId={`yaxis-${s.name}`}
										domain={[s.min, s.max]}
										orientation={i % 2 === 0 ? "left" : "right"}
										label={
											<Label
												value={yAxisTitles[s.name]}
												angle={i % 2 === 0 ? -90 : 90}
											/>
										}
									/>

									{s.chartType === "line" ? (
										<Line
											key={`line-${s.name}-${id}`}
											type="monotone"
											dataKey="y"
											name={s.name}
											stroke={s.color}
											strokeDasharray={getStrokeDashArray(s.lineStyle)}
											data={s.data}
											yAxisId={`yaxis-${s.name}`}
											dot={false}
										/>
									) : (
										<Bar
											key={`bar-${s.name}-${id}`}
											dataKey="y"
											name={s.name}
											fill={s.barStyle === "solid" ? s.color : "none"}
											stroke={s.color}
											data={s.data}
											yAxisId={`yaxis-${s.name}`}
										/>
									)}
								</>
							))}
						</ComposedChart>
					</ResponsiveContainer>
				</ChartContent>
				<CardActions />
			</ChartContainer>
		</>
	);
};
