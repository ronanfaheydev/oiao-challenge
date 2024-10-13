import { CircularProgress, FormGroup, TextField } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import styled from "styled-components";
import { chartHeight, chartWidth } from "./constants";

export interface ChartSeries {
	name: string;
	data: { y: number; x: number }[];
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

const ChartContainer = styled.div`
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

export const Chart = ({ data, id, isLoading, onDateChange }: ChartProps) => {
	const _minDate = useMemo(
		() => data.length && Math.min(0, ...data.map((s) => s.minDate)),
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
			console.log(dates, _dates);
			setDates(_dates);
			onDateChange(_dates);
		},
		[dates, onDateChange]
	);

	return (
		<ChartContainer>
			{isLoading && (
				<Loading>
					<CircularProgress />
				</Loading>
			)}
			<div>
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
			</div>
			<div>
				<LineChart
					width={chartWidth}
					height={chartHeight}
					margin={lineChartProps}
				>
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
						cursor={{ strokeDasharray: "3 3" }}
					/>
					<Legend />

					{data?.map((s, i) => (
						<>
							<Line
								key={s.name}
								type="monotone"
								dataKey="y"
								name={s.name}
								stroke={s.color}
								data={s.data}
								yAxisId={s.name}
								dot={false}
							/>
							<YAxis
								dataKey="y"
								yAxisId={s.name}
								domain={[s.min, s.max]}
								orientation={i % 2 === 0 ? "left" : "right"}
							/>
						</>
					))}
				</LineChart>
			</div>
		</ChartContainer>
	);
};
