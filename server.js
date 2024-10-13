import axios from "axios";
import cors from "cors";
import express from "express";
import os from "os";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to enable CORS
app.use(cors());

// Enable parsing of JSON bodies
app.use(express.json());

// Proxy route
app.get("*", async (req, res) => {
	try {
		const queryParams = new URLSearchParams(req.query);
		// Construct the target URL
		const targetUrl = `https://api.stlouisfed.org${req.path}?${queryParams.toString()}`;

		console.log(`Forwarding request to: ${targetUrl}`);

		// Forward the request to the FRED API
		const response = await axios.get(targetUrl);

		// Set CORS headers
		res.set("Access-Control-Allow-Origin", "*");
		res.status(response.status).send(response.data);
	} catch (error) {
		console.error("Error forwarding request:", error);
		res.status(500).send("Internal Server Error");
	}
});

// Function to get the local IP address
const getLocalIPAddress = () => {
	const interfaces = os.networkInterfaces();
	for (const interfaceName in interfaces) {
		for (const interfaceInfo of interfaces[interfaceName]) {
			// Skip internal (loopback) addresses and non-IP4 addresses
			if (interfaceInfo.family === "IPv4" && !interfaceInfo.internal) {
				return interfaceInfo.address;
			}
		}
	}
	return "localhost"; // Fallback to localhost if no local IP found
};

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
	console.log(`Server is running on http://${getLocalIPAddress()}:${PORT}`);
});
