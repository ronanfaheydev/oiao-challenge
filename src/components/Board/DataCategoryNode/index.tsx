import { Clear } from "@mui/icons-material";
import {
	Autocomplete,
	Button,
	Card,
	CardContent,
	CardHeader,
	CircularProgress,
	FormHelperText,
	InputLabel,
	TextField,
	Typography,
} from "@mui/material";
import { Handle, Position } from "@xyflow/react";
import { useCallback, useContext, useState } from "react";
import styled from "styled-components";
import { useGetSeriesSearch, type SeriesSearchData } from "../../../queries";
import ErrorBoundary from "../../ErrorBoundary";
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

const StyledHandle = styled(Handle)<{ isOn: boolean }>`
	background-color: ${({ isOn }) => (isOn ? "green" : "white")};
	border: 2px solid ${({ isOn }) => (isOn ? "green" : "lightgray")};
	border-radius: 5px;
	width: 10px;
	height: 20px;
	margin: auto;
`;

interface DataSourceNodeProps {
	id: string;
}

function DataSourceNode({ id }: DataSourceNodeProps) {
	const [selectedSeries, setSelectedSeries] = useState<SeriesSearchData | null>(
		null
	);
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
		}
	);

	const { updateNode } = useContext(BoardContext);

	const onChange = useCallback(
		(value: SeriesSearchData) => {
			setSelectedSeries(value);
			updateNode(id, { series: value, isReady: true });
		},
		[id, updateNode]
	);

	const onCardClear = useCallback(() => {
		setSelectedSeries(null);
		updateNode(id, { series: null, isReady: false });
	}, [id, updateNode]);

	if (seriesSearchError) {
		throw seriesSearchError;
	}

	return (
		<>
			<StyledHandle
				type="source"
				position={Position.Right}
				isOn={!!selectedSeries}
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
								onChange={(evt, value) => {
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
