import {AuthenticatedRequest, ContentTransformerRequest, ContentTransformerResponse} from '../models/transformation-request.js';
import { Response } from 'express';

import { generateHTML, generateJSON } from '@tiptap/html'

import StarterKit from '@tiptap/starter-kit';
import { ActionType } from '../models/action.js';
import Image from '@tiptap/extension-image'
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle, { TextStyleOptions } from '@tiptap/extension-text-style'
import Link from '@tiptap/extension-link'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import {Video} from '@edifice-tiptap-extensions/extension-video'
import {IFrame} from '@edifice-tiptap-extensions/extension-iframe'


const EXTENSIONS = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] } as Partial<TextStyleOptions>),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
  }),
  Image,
  Link.configure({
    openOnClick: true,
  }),
  Table.configure({
    resizable: true,
  }),
  TableRow,
  TableHeader,
  TableCell,
  Video,
  IFrame
]

export function transformController(req: AuthenticatedRequest, res: Response, serviceVersion: number): Promise<void> {
  const data: ContentTransformerRequest = req.body as ContentTransformerRequest
  data.contentVersion = serviceVersion;
  if(data.action === ActionType.HTML2JSON) {
    return html2Json(data, res);
  } else {
    return json2Html(data, res);
  }
}

function html2Json(data: ContentTransformerRequest, res: Response<any, Record<string, any>>): Promise<void> {
  const response: ContentTransformerResponse = {
    contentVersion: data.contentVersion,
    jsonContent: generateJSON(data.htmlContent, EXTENSIONS)
  } as ContentTransformerResponse;
  res.json(response);
  return Promise.resolve();
}
function json2Html(data: ContentTransformerRequest, res: Response<any, Record<string, any>>): Promise<void> {
  const response: ContentTransformerResponse = {
    contentVersion: data.contentVersion,
    htmlContent: generateHTML(data.jsonContent, EXTENSIONS)
  } as ContentTransformerResponse;
  res.json(response);
  return Promise.resolve();
}

