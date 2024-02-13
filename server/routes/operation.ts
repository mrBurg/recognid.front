import express from 'express';
import path from 'path';
import fs from 'fs';

import cfg from './../config.json';
import faceTecStrings from './../data/faceTecStrings.json';
import productionKey from './../data/productionKey.json';
import { generateUUId, jsonToQueryString } from '../utils';

const router = express.Router();

let counter = 0;

router.get('/start', async (req, res, _next) => {
  const { query } = req;
  counter++;

  console.log(
    `Number of tries ${counter} with params ${JSON.stringify(query)}`
  );

  return res.status(cfg.status.temporaryRedirect).json({
    location: `/processing?id=${Math.round(Math.random() * 1e6)}`,
  });
});

router.get('/config/field', (req, res) => {
  console.log(req.query);

  const ssh_public_key = fs.readFileSync(
    path.join(__dirname, './../data/publicKey.txt'),
    'utf-8'
  );

  return res.send({
    value: {
      ssh_public_key,
      device_key: 'dMFKHvAjEESNKTp23rdfNlt7xRLKbgkH',
      id_scan_path: '/match-3d-2d-idscan',
      base_url: 'https://recid.finmdtest.com/ft',
      session_path: '/session-token',
      production_key: JSON.stringify(productionKey, null, 2),
      id_scan_timeout: 30,
      enrollment_path: '/enrollment-3d',
      session_timeout: 10,
      enrollment_timeout: 30,
    },
  });
});

router.get('/config/file/550ebb7e527704512e6653fc75c263fa', (req, res) => {
  console.log(req.query);

  return res.send(faceTecStrings);
});

router.get('/config/timeout', (req, res) => {
  console.log(req.query);

  return res.send({ value: 300 });
});

router.get('/check', (_req, res) => {
  return res.send({
    redirectURI: `/processing${jsonToQueryString({
      id: generateUUId(),
    })}`,
  });
});

export default router;
