import {
	Card,
	CardContent,
	CircularProgress,
	FormControl,
	FormControlLabel,
	FormGroup,
	Radio,
	RadioGroup,
	TextField,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	Line,
	LineChart,
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
	width: 100%;
	height: 100%;
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
	height: calc(100% - ${chartHeaderHeight}px);
	min-height: ${chartHeight}px;
	min-width: ${chartWidth}px;
	padding: 0;
`;

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

	const [chartType, setChartType] = useState<"line" | "bar">("line");

	const onChartTypeChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setChartType(e.target.value as "line" | "bar");
		},
		[]
	);

	const ChartComponent = useMemo(
		() => (chartType === "line" ? LineChart : BarChart),
		[chartType]
	);

	return (
		<ChartContainer data-testid="chart-container">
			{isLoading && (
				<Loading>
					<CircularProgress />
				</Loading>
			)}
			<ChartHeader>
				<TextField
					name="chart_title"
					defaultValue="New Chart"
					fullWidth
					label="Title"
				/>

				<ChartInputs>
					<FormControl>
						<RadioGroup
							onChange={onChartTypeChange}
							row
							defaultValue="line"
							name="chart-type"
						>
							<FormControlLabel value="line" control={<Radio />} label="line" />
							<FormControlLabel value="bar" control={<Radio />} label="bar" />
						</RadioGroup>
					</FormControl>
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
					<ChartComponent margin={lineChartProps} data={data}>
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
								/>

								{chartType === "line" ? (
									<Line
										key={`line-${s.name}-${id}`}
										type="monotone"
										dataKey="y"
										name={s.name}
										stroke={s.color}
										fill={s.color}
										data={s.data}
										yAxisId={`yaxis-${s.name}`}
										dot={false}
									/>
								) : (
									<Bar
										key={`bar-${s.name}-${id}`}
										dataKey="y"
										name={s.name}
										fill={s.color}
										data={s.data}
										yAxisId={`yaxis-${s.name}`}
									/>
								)}
							</>
						))}
					</ChartComponent>
				</ResponsiveContainer>
			</ChartContent>
		</ChartContainer>
	);
};
