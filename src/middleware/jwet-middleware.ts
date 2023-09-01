import {AuthenticatedRequest} from '../models/transformation-request';
import express, { Express, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const secret = <string>process.env.JWT_SECRET;

export function authenticateToken(req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, secret, (err: any, user: any) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.user = user;
    next();
  });
}

export function toto() {
  console.log("toto")
}