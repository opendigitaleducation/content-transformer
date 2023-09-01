import { AuthenticatedRequest, ContentTransformerRequest, ContentTransformerResponse } from '../models/transformation-request.js';
import { Response } from 'express';
import { ActionType } from '../models/action.js';

import { generateHTML, generateJSON } from '@tiptap/html'

import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image'
import { Color } from '@tiptap/extension-color'
import Highlight from "@tiptap/extension-highlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import ListItem from '@tiptap/extension-list-item'
import TextStyle, { TextStyleOptions } from '@tiptap/extension-text-style'
import Link from '@tiptap/extension-link'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import { TypoSize } from "@edifice-tiptap-extensions/extension-typosize";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import { Video } from '@edifice-tiptap-extensions/extension-video'
import { IFrame } from '@edifice-tiptap-extensions/extension-iframe'


const EXTENSIONS = [
  StarterKit,
  Highlight.configure({
    multicolor: true,
  }),
  Underline,
  TextStyle,
  Color,
  Subscript,
  Superscript,
  Image,
  Link,
  Table,
  TableRow,
  TableHeader,
  TableCell,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Video,
  IFrame,
  Typography,
  TypoSize,
]

export function transformController(req: AuthenticatedRequest, res: Response, serviceVersion: number): Promise<void> {
  const data: ContentTransformerRequest = req.body as ContentTransformerRequest
  console.log(data)
  data.contentVersion = serviceVersion;
  if (data.action === ActionType.HTML2JSON) {
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

