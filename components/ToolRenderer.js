"use client";

import { getToolBySlug } from "@/lib/tools-registry";
import GenericToolRenderer from "@/components/GenericToolRenderer";

// Direct component imports
import WordCounter from "@/components/tools/WordCounter";
import CaseConverter from "@/components/tools/CaseConverter";
import JsonFormatter from "@/components/tools/JsonFormatter";
import TextReverser from "@/components/tools/TextReverser";
import RemoveExtraSpaces from "@/components/tools/RemoveExtraSpaces";
import RemoveDuplicateLines from "@/components/tools/RemoveDuplicateLines";
import RemovePunctuation from "@/components/tools/RemovePunctuation";
import UuidGenerator from "@/components/tools/UuidGenerator";
import PasswordGenerator from "@/components/tools/PasswordGenerator";
import Md5Hash from "@/components/tools/Md5Hash";
import Sha256Hash from "@/components/tools/Sha256Hash";
import Base64EncodeDecode from "@/components/tools/Base64EncodeDecode";
import UrlEncodeDecode from "@/components/tools/UrlEncodeDecode";
import TextBinaryHex from "@/components/tools/TextBinaryHex";
import LengthConverter from "@/components/tools/LengthConverter";
import WeightConverter from "@/components/tools/WeightConverter";
import RandomTeamGenerator from "@/components/tools/RandomTeamGenerator";
import AddLineNumbers from "@/components/tools/AddLineNumbers";
import SortTextLines from "@/components/tools/SortTextLines";
import CssBeautifier from "@/components/tools/CssBeautifier";
import MorseCodeConverter from "@/components/tools/MorseCodeConverter";

import WordToPdf from "@/components/tools/WordToPdf";
import PdfToWord from "@/components/tools/PdfToWord";
import MergePdf from "@/components/tools/MergePdf";
import ProtectPdf from "@/components/tools/ProtectPdf";
import CompressPdf from "@/components/tools/CompressPdf";
import EditPdfText from "@/components/tools/EditPdfText";
import ResizePdfImages from "@/components/tools/ResizePdfImages";
import ImageToPdf from "@/components/tools/ImageToPdf";
import ExcelToPdf from "@/components/tools/ExcelToPdf";
import PptToPdf from "@/components/tools/PptToPdf";

import MergeWord from "@/components/tools/MergeWord";
import CropJpg from "@/components/tools/CropJpg";

// Newly added high-demand custom tools
import Sha512Hash from "@/components/tools/Sha512Hash";
import Sha384Hash from "@/components/tools/Sha384Hash";
import FindReplace from "@/components/tools/FindReplace";
import RemoveEmptyLines from "@/components/tools/RemoveEmptyLines";
import StringToBinary from "@/components/tools/StringToBinary";
import BinaryToString from "@/components/tools/BinaryToString";
import HexToString from "@/components/tools/HexToString";
import AsciiToText from "@/components/tools/AsciiToText";
import JsonToCsv from "@/components/tools/JsonToCsv";
import NumbersToWords from "@/components/tools/NumbersToWords";
import HexToRgb from "@/components/tools/HexToRgb";
import SnakeCamelConverter from "@/components/tools/SnakeCamelConverter";
import ReplaceNewlines from "@/components/tools/ReplaceNewlines";
import RandomGenerators from "@/components/tools/RandomGenerators";
import VideoTools from "@/components/tools/VideoTools";
import MuteVideo from "@/components/tools/MuteVideo";
import LatexCompiler from "@/components/tools/LatexCompiler";
import TextCleaner from "@/components/tools/TextCleaner";
import LogoMaker from "@/components/tools/LogoMaker";
import QrCodeGenerator from "@/components/tools/QrCodeGenerator";
import SourceCodeHighlighter from "@/components/tools/SourceCodeHighlighter";
import DomainNameExtractor from "@/components/tools/DomainNameExtractor";
import ImageToBase64 from "@/components/tools/ImageToBase64";
import FiveGNRThroughput from "@/components/tools/FiveGNRThroughput";
import FiveGArfcnCalculator from "@/components/tools/FiveGArfcnCalculator";
import InvoiceGenerator from "@/components/tools/InvoiceGenerator";
import PngToWebp from "@/components/tools/PngToWebp";

const componentMap = {
  "png-to-webp": PngToWebp,
  "free-invoice-generator": InvoiceGenerator,
  "5g-arfcn-to-frequency": FiveGArfcnCalculator,
  "5g-nr-throughput": FiveGNRThroughput,
  "image-to-base64": ImageToBase64,
  "domain-name-extractor": DomainNameExtractor,
  "source-code-highlighter": SourceCodeHighlighter,
  "qr-code-generator": QrCodeGenerator,
  "free-logo-maker": LogoMaker,
  "text-cleaner": TextCleaner,
  "latex-compiler": LatexCompiler,
  "word-counter": WordCounter,
  "case-converter": CaseConverter,
  "json-formatter": JsonFormatter,
  "text-reverser": TextReverser,
  "remove-extra-spaces": RemoveExtraSpaces,
  "remove-duplicate-lines": RemoveDuplicateLines,
  "remove-punctuation": RemovePunctuation,
  "uuid-generator": UuidGenerator,
  "password-generator": PasswordGenerator,
  "md5-hash": Md5Hash,
  "sha256-hash": Sha256Hash,
  "base64-encode-decode": Base64EncodeDecode,
  "url-encode-decode": UrlEncodeDecode,
  "text-binary-hex": TextBinaryHex,
  "length-converter": LengthConverter,
  "weight-converter": WeightConverter,
  "random-team-generator": RandomTeamGenerator,
  "add-line-numbers": AddLineNumbers,
  "sort-text-lines": SortTextLines,
  "css-beautifier": CssBeautifier,
  "morse-code-converter": MorseCodeConverter,

  "word-to-pdf": WordToPdf,
  "pdf-to-word": PdfToWord,
  "merge-pdf": MergePdf,
  "protect-pdf": ProtectPdf,
  "compress-pdf": CompressPdf,
  "edit-pdf-text": EditPdfText,
  "resize-pdf-images": ResizePdfImages,
  "image-to-pdf": ImageToPdf,
  "excel-to-pdf": ExcelToPdf,
  "ppt-to-pdf": PptToPdf,

  "merge-word": MergeWord,
  "crop-jpg": CropJpg,

  // New Mappings
  "sha512-hash": Sha512Hash,
  "sha384-hash": Sha384Hash,
  "find-replace": FindReplace,
  "remove-empty-lines": RemoveEmptyLines,
  "remove-empty-lines-general": RemoveEmptyLines,
  "text-binary-converter": StringToBinary,
  "binary-to-string": BinaryToString,
  "hex-to-string": HexToString,
  "ascii-to-text": AsciiToText,
  "json-to-csv": JsonToCsv,
  "numbers-to-words": NumbersToWords,
  "hex-to-rgb": HexToRgb,
  "snake-case-to-camel": SnakeCamelConverter,
  "replace-newlines-commas": () => <ReplaceNewlines defaultSeparator="commas" />,
  "replace-newlines-semicolons": () => <ReplaceNewlines defaultSeparator="semicolons" />,

  // Video Tools
  "video-tools": VideoTools,
  "mute-video": MuteVideo,
  "video-to-gif": VideoTools,

  // Random generators
  "random-emoji": () => <RandomGenerators type="random-emoji" title="Random Emoji Generator" />,
  "random-animal": () => <RandomGenerators type="random-animal" title="Random Animal Generator" />,
  "random-food": () => <RandomGenerators type="random-food" title="Random Food Generator" />,
  "random-hobby": () => <RandomGenerators type="random-hobby" title="Random Hobby Generator" />,
  "random-movie": () => <RandomGenerators type="random-movie" title="Random Movie Generator" />,
  "random-fruits": () => <RandomGenerators type="random-fruits" title="Random Fruit Generator" />,
  "random-marvel-character": () => <RandomGenerators type="random-marvel-character" title="Random Marvel Character Generator" />,
  "random-disney-character": () => <RandomGenerators type="random-disney-character" title="Random Disney Character Generator" />,
  "random-female-name": () => <RandomGenerators type="random-female-name" title="Random Female Name Generator" />,
  "random-male-name": () => <RandomGenerators type="random-male-name" title="Random Male Name Generator" />,
};

export default function ToolRenderer({ slug }) {
  const Component = componentMap[slug];

  if (!Component) {
    const tool = getToolBySlug(slug);
    return <GenericToolRenderer tool={tool} />;
  }

  return <Component />;
}
