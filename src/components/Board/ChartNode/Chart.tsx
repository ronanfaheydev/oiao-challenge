import { useMemo } from "react";
import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

export interface ChartSeries {
	name: string;
	data: { y: number; x: number }[];
	color: string;
}

export interface ChartProps {
	data: ChartSeries[];
}

const lineChartProps = {
	top: 5,
	right: 30,
	left: 20,
	bottom: 5,
};

export const Chart = ({ data }: ChartProps) => {
	const minDate = useMemo(
		() => data.length && Math.min(...data.map((s) => s.minDate)),
		[data]
	);
	const maxDate = useMemo(
		() => data.length && Math.max(...data.map((s) => s.maxDate)),
		[data]
	);

	return (
		<div>
			<div>
				<LineChart width={500} height={300} margin={lineChartProps}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis
						scale="time"
						type="number"
						tickFormatter={(tick) => {
							const date = new Date(tick);
							return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
						}}
						dataKey="x"
						domain={[minDate, maxDate]}
						allowDuplicatedCategory={false}
					/>
					<Tooltip
						labelFormatter={(label) => {
							const date = new Date(label);
							return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
						}}
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
		</div>
	);
};
