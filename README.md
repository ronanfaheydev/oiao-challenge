# FRED

# Steps to run

1.  Add your .env file with

- VITE_FRED_API_KEY
- VITE_FRED_API_URL

2. Start the local proxy server - this will get around CORS issues
   `yarn proxy`
3. Start the local dev server
   `yarn dev`

## General plan

Let's make this chart creation very interactive
We will use react flow to create the canvas board
You click to add a node
The node will be a data source or a chart
You can then join a data source to a chart to show the data on that chart
simple!
Data is fetched with tanstack query

### Choices

- Use scss instead of some css-in-js library or tailwind
- Use a pre built component library for speed
- Use a canvas board for an interface
- Use tanstack query and recharts, as used in Open Innovation AI

## Steps

1. Create the react flow board
2. Create a data node
3. Connect the data node to the API for finding the categories
4. Simple dropdown selectors for selecting the data source
5. Create a chart node
6. Chart node takes in a data source, which is just a category id for a query
7. Fetch the series data and render the chart
8. Allow the chart dates to be changable

## Notes

- OpenAPI schema found here https://github.com/armanobosyan/FRED-OpenAPI-specification
- Endpoints created with https://orval.dev/playground
- Proxy requests using https://www.npmjs.com/package/local-cors-proxy
- Thought about using zustand for node state, not necessary for this project I would say
- I need to set up the API on an external server if I want to use on mobile to test
  - Using GCP
- There are a few uses of `any` introduced. The created types from the generator were difficult to get working
