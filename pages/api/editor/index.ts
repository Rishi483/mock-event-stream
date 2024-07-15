import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

const dataFilePath = path.join(process.cwd(), 'mock-event-stream-data.json');

interface EditorRequest extends NextApiRequest {
  body: {
    key?: string;
    value?: any;
  };
}

export default async function handler(req: EditorRequest, res: NextApiResponse) {
  const { method } = req;
  const { key, value } = req.body;
    
  switch (method) {
    case 'POST':
      await handlePost(req, res, key, value);
      break;
    case 'PUT':
      await handlePut(req, res, key, value);
      break;
    case 'DELETE':
      await handleDelete(req, res, key);
      break;
    case 'GET':
      await handleGet(req, res);
      break;
    default:
      res.setHeader('Allow', ['POST', 'PUT', 'DELETE', 'GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function handlePost(req: EditorRequest, res: NextApiResponse, key?: string, value?: any) {
  if (!key || value === undefined) {
    return res.status(400).send('Bad Request: key and value are required.');
  }

  try {
    const data = await fs.promises.readFile(dataFilePath, 'utf8');
    const jsonData = JSON.parse(data);
    jsonData[key] = value;
    await fs.promises.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2), 'utf8');
    res.status(201).send('Successfully added the data');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error.');
  }
}

async function handlePut(req: EditorRequest, res: NextApiResponse, key?: string, value?: any) {
  if (!key || value === undefined) {
    return res.status(400).send('Bad Request: key and value are required.');
  }

  try {
    const data = await fs.promises.readFile(dataFilePath, 'utf8');
    const jsonData = JSON.parse(data);

    if (jsonData[key]) {
      jsonData[key] = value;
      await fs.promises.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2), 'utf8');
      res.send('Data successfully updated.');
    } else {
      res.status(404).send('Key not found.');
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error.');
  }
}

async function handleDelete(req: EditorRequest, res: NextApiResponse, key?: string) {
  if (!key) {
    return res.status(400).send('Bad Request: key is required.');
  }

  try {
    const data = await fs.promises.readFile(dataFilePath, 'utf8');
    const jsonData = JSON.parse(data);

    if (jsonData[key]) {
      delete jsonData[key];
      await fs.promises.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2), 'utf8');
      res.send('Data successfully deleted.');
    } else {
      res.status(404).send('Key not found.');
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error.');
  }
}

async function handleGet(req: EditorRequest, res: NextApiResponse) {
  try {
    const data = await fs.promises.readFile(dataFilePath, 'utf8');
    const jsonData = JSON.parse(data);
    res.status(200).json(jsonData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error.');
  }
}
