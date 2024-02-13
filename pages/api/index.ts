import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  /* if (req.method === 'POST') {
    console.log('Process a POST request');
  } else {
    console.log('Handle any other HTTP method');
  } */

  // res.setHeader('Location', '/api/redirect');
  // res.setHeader('X-Requested-With', 'XMLHttpRequest');
  // res.status(303);

  res.send(null); //.redirect(303, '/api/redirect');
  // res.status(303).send(null); //.redirect(303, '/api/redirect');
}
