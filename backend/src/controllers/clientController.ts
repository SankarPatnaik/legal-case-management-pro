import { Request, Response } from 'express';
import Case from '../models/Case';
import Client from '../models/Client';

export const createClient = async (req: Request, res: Response) => {
  try {
    const client = await Client.create(req.body);
    res.status(201).json(client);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getClients = async (_req: Request, res: Response) => {
  const clients = await Client.find().populate('cases', 'title status caseType');
  res.json(clients);
};

export const attachCaseToClient = async (req: Request, res: Response) => {
  const { caseId } = req.body as { caseId: string };
  const client = await Client.findById(req.params.id);
  if (!client) {
    return res.status(404).json({ message: 'Client not found' });
  }

  const matter = await Case.findById(caseId);
  if (!matter) {
    return res.status(404).json({ message: 'Case not found' });
  }

  if (!client.cases.some((c) => c.toString() === caseId)) {
    client.cases.push(matter._id);
    await client.save();
  }

  if (!matter.client || matter.client.toString() !== client._id.toString()) {
    matter.client = client._id;
    await matter.save();
  }

  const populated = await client.populate('cases', 'title status caseType');
  res.json(populated);
};
