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
import { MathJax } from '@edifice-tiptap-extensions/extension-mathjax'
import { Attachment } from '@edifice-tiptap-extensions/extension-attachment'
import { cleanHtmlCounter, cleanHtmlTimer, cleanJsonCounter, cleanJsonTimer, h2jCounter, h2jTimer, h2plainTextCounter, h2plainTextTimer, j2hCounter, j2hTimer, j2plainTextCounter, j2plainTextTimer, updateCounterAndTimer } from './metrics-controller.js';


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
  MathJax,
  Attachment,
  Typography,
  TypoSize,
]

export function transformController(req: AuthenticatedRequest, res: Response, serviceVersion: number): Promise<void> {
  const data: ContentTransformerRequest = req.body as ContentTransformerRequest;
  let generatedHtmlContent;
  let generatedJsonContent;
  let plainTextContent;
  let cleanHtml;
  let cleanJson;
  if (!data.htmlContent && !data.jsonContent) {
    res.send('No specified content to transform.');
    return Promise.resolve();
  } else {
    if (data.requestedFormats.includes(TransformationFormat.HTML)) {
      // Transforming content to HTML
      if (data.jsonContent != null) {
        const start = Date.now();
        generatedHtmlContent = generateHTML(data.jsonContent, EXTENSIONS);
        updateCounterAndTimer(start, j2hCounter, j2hTimer);
      }
      // Cleaning HTML content
      if (data.htmlContent != null) {
        const start = Date.now();
        cleanHtml = generateHTML(generateJSON(data.htmlContent, EXTENSIONS), EXTENSIONS);
        updateCounterAndTimer(start, cleanHtmlCounter, cleanHtmlTimer);
      }
    }
    if (data.requestedFormats.includes(TransformationFormat.JSON)) {
      // Transforming content to JSON
      if (data.htmlContent != null) {
        const start = Date.now();
        generatedJsonContent = generateJSON(data.htmlContent, EXTENSIONS);
        updateCounterAndTimer(start, h2jCounter, h2jTimer);
      }
      // Cleaning JSON content
      if (data.jsonContent != null) {
        const start = Date.now();
        cleanJson = generateJSON(generateHTML(data.jsonContent, EXTENSIONS), EXTENSIONS);
        updateCounterAndTimer(start, cleanJsonCounter, cleanJsonTimer);
      }
    }
    // Transforming content to PLAIN TEXT
    if (data.requestedFormats.includes(TransformationFormat.PLAINTEXT)) {
      if (data.jsonContent != null) {
        const start = Date.now();
        plainTextContent = generateText(data.jsonContent, EXTENSIONS);
        updateCounterAndTimer(start, j2plainTextCounter, j2plainTextTimer);
      } else if (data.htmlContent != null) {
        const start = Date.now();
        if (generatedJsonContent != null) {
          plainTextContent = generateText(generatedJsonContent, EXTENSIONS);
        } else {
          plainTextContent = generateText(generateJSON(data.htmlContent, EXTENSIONS), EXTENSIONS);
        }
        updateCounterAndTimer(start, h2plainTextCounter, h2plainTextTimer);
      }
    }
    const response: ContentTransformerResponse = {
      contentVersion: serviceVersion,
      htmlContent: generatedHtmlContent,
      jsonContent: generatedJsonContent,
      plainTextContent: plainTextContent,
      cleanHtml: cleanHtml,
      cleanJson: cleanJson
    } as ContentTransformerResponse;
    res.json(response);
    return Promise.resolve();
  }
}

