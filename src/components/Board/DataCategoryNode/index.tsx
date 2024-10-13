import { Clear } from "@mui/icons-material";
import { Autocomplete, Button, TextField } from "@mui/material";
import { Handle, Position } from "@xyflow/react";
import { useCallback, useContext, useState } from "react";
import styled from "styled-components";
import { useGetSeriesSearch, type SeriesSearchData } from "../../../queries";
import BoardContext from "../context";

const DataCategoryNodeContainer = styled.div`
	background-color: #fff;
	border: 1px solid #ccc;
	border-radius: 5px;
	box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
	padding: 1em;
`;

function DataNode({ data, id, ...rest }) {
	const [selectedSeries, setSelectedSeries] = useState<SeriesSearchData | null>(
		null
	);
	const [searchText, setSearchText] = useState("");

	const {
		data: seriesSearch,
		isLoading: seriesLoading,
		isError: seriesError,
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

	return (
		<>
			{selectedSeries && <Handle type="source" position={Position.Right} />}
			<DataCategoryNodeContainer>
				{selectedSeries ? (
					<div>
						<Button
							variant="outlined"
							onClick={() => {
								setSelectedSeries(null);
								updateNode(id, { series: null, isReady: false });
							}}
						>
							<Clear />
						</Button>
						<h3>{selectedSeries.title}</h3>
						<p>{selectedSeries.frequency}</p>
						<p>{selectedSeries.id}</p>
					</div>
				) : (
					<>
						<Autocomplete
							freeSolo
							style={{ width: 300 }}
							options={seriesSearch?.seriess || []}
							getOptionLabel={(option: any) =>
								`${option.title} (${option.units_short}) - ${option.id}`
							}
							isOptionEqualToValue={(option, value) => option.id === value.id}
							renderInput={(params) => (
								<TextField
									{...params}
									placeholder="Search for a data series"
									onChange={(evt) => {
										setSearchText(evt.target.value);
									}}
								/>
							)}
							onChange={(evt, value) => {
								onChange(value);
							}}
						/>
					</>
				)}
			</DataCategoryNodeContainer>
		</>
	);
}

export default DataNode;
