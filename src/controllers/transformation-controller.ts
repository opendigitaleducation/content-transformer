import { AuthenticatedRequest, ContentTransformerRequest, ContentTransformerResponse } from '../models/transformation-request.js';
import { Response } from 'express';
import { TransformationFormat } from '../models/format.js';

import { generateHTML, generateJSON } from '@tiptap/html'
import { generateText } from '@tiptap/core';

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
  if (data.htmlContent != null) {
    return transformHtml(data, res);
  } else if (data.jsonContent != null){
    return transformJson(data, res);
  } else {
    res.send('No specified content to transform.');
    return Promise.resolve();
  }
}

function transformHtml(data: ContentTransformerRequest, res: Response<any, Record<string, any>>): Promise<void> {
  const generatedJsonContent = generateJSON(data.htmlContent, EXTENSIONS);
  let jsonContent;
  let plainTextContent;
  if (data.requestedFormats.includes(TransformationFormat.JSON)) {
    jsonContent = generatedJsonContent;
  }
  if (data.requestedFormats.includes(TransformationFormat.PLAINTEXT)) {
    plainTextContent = generateText(generatedJsonContent, EXTENSIONS);
  }
  const response: ContentTransformerResponse = {
    contentVersion: data.contentVersion,
    jsonContent: jsonContent,
    plainTextContent: plainTextContent
  } as ContentTransformerResponse;
  res.json(response);
  return Promise.resolve();
}
function transformJson(data: ContentTransformerRequest, res: Response<any, Record<string, any>>): Promise<void> {
  let htmlContent;
  let plainTextContent;
  if (data.requestedFormats.includes(TransformationFormat.HTML)) {
    htmlContent = generateHTML(data.jsonContent, EXTENSIONS);
  }
  if (data.requestedFormats.includes(TransformationFormat.PLAINTEXT)) {
    plainTextContent = generateText(data.jsonContent, EXTENSIONS);
  }
  const response: ContentTransformerResponse = {
    contentVersion: data.contentVersion,
    htmlContent: htmlContent,
    plainTextContent: plainTextContent
  } as ContentTransformerResponse;
  res.json(response);
  return Promise.resolve();
}

