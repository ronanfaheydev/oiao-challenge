# FRED

# Steps to run

1.  Add your .env file with

- VITE_FRED_API_KEY
- VITE_FRED_API_URL

2. Start the local proxy server - this will get around CORS issues.
   `yarn server`
3. Start the local dev server
   `yarn dev`
4. Add a data source. Search for e.g. CPI and select an option from the list.
5. Connect the data source to the chart using the handles.
6. Add another data source and connect to the chart. Series get their own y axis, this is the easiest way of dealing with the variability in the data.
7. You can change the color and style of the series from the source.
8. You can update the axis titles and chart title from the edit button next to the chart title.

## General plan

Let's make this chart creation very interactive
We will use react flow to create the canvas board
You click to add a node
The node will be a data source or a chart
You can then join a data source to a chart to show the data on that chart
simple!
Data is fetched, cached etc. with tanstack query
Data sources define the look of the data on the chart - color, style
Chart itself contains the

### Choices

- Use styled-components
- Use a pre built component library for speed
- Use a canvas board for an interface - react-flow
- Use tanstack query and recharts, as used in Open Innovation AI

## Dev plan

1. Create the react flow board
2. Create a data node
3. Connect the data node to the API for finding the categories
4. Simple dropdown selectors for selecting the data source
5. Create a chart node
6. Chart node takes in a data source, which is just a category id for a query
7. Fetch the series data and render the chart
8. Allow the chart dates to be changed
9. Add additional functionality as required in spec

## Notes

- OpenAPI schema found here https://github.com/armanobosyan/FRED-OpenAPI-specification
- Endpoints created with https://orval.dev/playground
- Proxy requests using https://www.npmjs.com/package/local-cors-proxy
- Thought about using zustand for node state, not necessary for this project I would say
- I set up two proxy servers because the first didn't show address for the local network to test mobile. `yarn proxy` also works.

## Issues

- Sometimes the Autocomplete is flaky
- Testing is minimal
- There are a few uses of `any` introduced. The created types from the generator were difficult to get working.
