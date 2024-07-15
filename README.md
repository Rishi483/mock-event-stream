# mock-event-stream

`mock-event-stream` is a Next.js package that provides a server to stream data from a JSON file in a event-stream or normal manner based on the query. It also includes a dashboard for testing and a CRUD API endpoint for editing the data.

## Installation
You can install mock-event-stream via npm:
```sh
npm install mock-event-stream
```

## Usage
### 1. Create Configuration File (Optional)

Create a `mock-event-stream-config.json` file at the root of your project in which you will install the package with the following structure:

- **port** : The port on which you want the package to run.

```json
{
  "port": 5000
}
```
### 2. Create Data File
Ensure that `mock-event-stream-data.json` is created at the root of your project. This file should contain the data you want to serve.

### 3. Start the Server

Add the following script to your `package.json` :
```json
{
  "scripts": {
    "start-server": "mock-event-stream"
  }
}
```
Then run:
```
npm run start-server
```
You will see this on terminal :
```
🚀 Dashboard running on http://localhost:5000/ 

🚀 Query API Route: /query/[q]

🚀 Data Edit API Route: /MockEventStream/editor
```

### 4. Access the data
The server listens on `http://localhost:5000/query/:q` where `:q` is the key to retrieve data from data.json.
#### Example
Assuming `data.json` contains:
``` json
{
  "greeting": "Hello, world!",
  "quote": "To be or not to be, that is the question."
}
```
- To get the greeting: `http://localhost:5000/query/greeting`
- To get the quote: `http://localhost:5000/query/quote`

### 5. Dashboard
Access the dashboard at http://localhost:5000/MockEventStream to test the data and view responses.

### 6. CRUD API Endpoint
Use the CRUD API at http://localhost:5000/MockEventStream/editor to edit the data in data.json. The API supports Create, Read, Update, and Delete operations for the data.