import { NextApiRequest, NextApiResponse } from 'next';

export default function(request: NextApiRequest, response: NextApiResponse) {
  const users = [
    {id: 1, name: 'Marcos'},
    {id: 2, name: 'Dani'},
    {id: 3, name: 'Rafa'},
  ];

  return response.json(users);
}