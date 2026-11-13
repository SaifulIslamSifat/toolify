import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getToolBySlug, TOOLS } from "@/lib/tools-registry";
import ToolLayout from "@/components/ToolLayout";

// Tool components
import BmiCalculator from "@/components/tools/BmiCalculator";
import AgeCalculator from "@/components/tools/AgeCalculator";
import PercentageCalculator from "@/components/tools/PercentageCalculator";
import LoanCalculator from "@/components/tools/LoanCalculator";
import DiscountCalculator from "@/components/tools/DiscountCalculator";
import TemperatureConverter from "@/components/tools/TemperatureConverter";
import LengthConverter from "@/components/tools/LengthConverter";
import WeightConverter from "@/components/tools/WeightConverter";
import StorageConverter from "@/components/tools/StorageConverter";
import WordCounter from "@/components/tools/WordCounter";
import CaseConverter from "@/components/tools/CaseConverter";
import TextDiffChecker from "@/components/tools/TextDiffChecker";
import SlugGenerator from "@/components/tools/SlugGenerator";
import LoremIpsumGenerator from "@/components/tools/LoremIpsumGenerator";
import JsonFormatter from "@/components/tools/JsonFormatter";
import PasswordGenerator from "@/components/tools/PasswordGenerator";
import QrCodeGenerator from "@/components/tools/QrCodeGenerator";
import UuidGenerator from "@/components/tools/UuidGenerator";
import Base64Converter from "@/components/tools/Base64Converter";
import HashGenerator from "@/components/tools/HashGenerator";
import TimestampConverter from "@/components/tools/TimestampConverter";
import RegexTester from "@/components/tools/RegexTester";
import ImageCompressor from "@/components/tools/ImageCompressor";
import ImageResizer from "@/components/tools/ImageResizer";
import ImageCropper from "@/components/tools/ImageCropper";
import ImageFormatConverter from "@/components/tools/ImageFormatConverter";
import ImageToBase64 from "@/components/tools/ImageToBase64";
import ImageRotator from "@/components/tools/ImageRotator";
import ImageColorPicker from "@/components/tools/ImageColorPicker";
import BackgroundRemover from "@/components/tools/BackgroundRemover";
import PdfMerge from "@/components/tools/PdfMerge";
import PdfSplit from "@/components/tools/PdfSplit";
import PdfRotate from "@/components/tools/PdfRotate";
import JpgToPdf from "@/components/tools/JpgToPdf";
import PdfMetadataViewer from "@/components/tools/PdfMetadataViewer";
import WordToPdf from "@/components/tools/WordToPdf";
import RobotsTxtGenerator from "@/components/tools/RobotsTxtGenerator";
import MetaTagGenerator from "@/components/tools/MetaTagGenerator";
import IpChecker from "@/components/tools/IpChecker";
import WebsiteStatusChecker from "@/components/tools/WebsiteStatusChecker";
import FiverrMessageChecker from "@/components/tools/FiverrMessageChecker";
import FiverrDeliverableFormatter from "@/components/tools/FiverrDeliverableFormatter";
import BarcodeGenerator from "@/components/tools/BarcodeGenerator";

interface ToolPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return TOOLS.map((tool) => ({
    slug: tool.slug,
  }));
}

export function generateMetadata({ params }: ToolPageProps): Metadata {
  const tool = getToolBySlug(params.slug);
  if (!tool) {
    return { title: "Tool Not Found - Toolify" };
  }

  return {
    title: `${tool.name} - Free Online Tool | Toolify`,
    description: tool.description,
    keywords: tool.keywords,
    openGraph: {
      title: `${tool.name} - Free Online Tool | Toolify`,
      description: tool.description,
      type: "website",
      url: `https://toolify.local/tools/${tool.slug}`,
    },
    twitter: {
      card: "summary",
      title: `${tool.name} - Free Online Tool`,
      description: tool.shortDescription,
    },
  };
}

export default function ToolPage({ params }: ToolPageProps) {
  const tool = getToolBySlug(params.slug);

  if (!tool) {
    notFound();
  }

  const renderToolComponent = () => {
    switch (tool.slug) {
      // Calculators
      case "bmi-calculator":
        return <BmiCalculator />;
      case "age-calculator":
        return <AgeCalculator />;
      case "percentage-calculator":
        return <PercentageCalculator />;
      case "loan-calculator":
        return <LoanCalculator />;
      case "discount-calculator":
        return <DiscountCalculator />;

      // Unit Converters
      case "celsius-to-fahrenheit":
        return <TemperatureConverter />;
      case "cm-to-feet":
        return <LengthConverter />;
      case "kg-to-pounds":
        return <WeightConverter />;
      case "mb-to-gb":
        return <StorageConverter />;

      // Text Tools
      case "word-counter":
        return <WordCounter />;
      case "case-converter":
        return <CaseConverter />;
      case "text-diff-checker":
        return <TextDiffChecker />;
      case "text-to-slug":
        return <SlugGenerator />;
      case "lorem-ipsum-generator":
        return <LoremIpsumGenerator />;

      // Developer Tools
      case "json-formatter":
        return <JsonFormatter />;
      case "password-generator":
        return <PasswordGenerator />;
      case "qr-code-generator":
        return <QrCodeGenerator />;
      case "barcode-generator":
        return <BarcodeGenerator />;
      case "uuid-generator":
        return <UuidGenerator />;
      case "base64-encoder-decoder":
        return <Base64Converter />;
      case "hash-generator":
        return <HashGenerator />;
      case "unix-timestamp-converter":
        return <TimestampConverter />;
      case "regex-tester":
        return <RegexTester />;

      // Image Tools
      case "image-compressor":
        return <ImageCompressor />;
      case "image-resizer":
        return <ImageResizer />;
      case "image-cropper":
        return <ImageCropper />;
      case "jpg-to-png":
        return <ImageFormatConverter defaultTarget="png" />;
      case "png-to-jpg":
        return <ImageFormatConverter defaultTarget="jpeg" />;
      case "webp-to-jpg":
        return <ImageFormatConverter defaultTarget="jpeg" />;
      case "image-to-base64":
        return <ImageToBase64 />;
      case "image-rotator":
        return <ImageRotator />;
      case "image-color-picker":
        return <ImageColorPicker />;
      case "background-remover":
        return <BackgroundRemover />;

      // PDF Tools
      case "merge-pdf":
        return <PdfMerge />;
      case "split-pdf":
        return <PdfSplit />;
      case "rotate-pdf":
        return <PdfRotate />;
      case "jpg-to-pdf":
        return <JpgToPdf />;
      case "pdf-metadata-viewer":
        return <PdfMetadataViewer />;
      case "word-to-pdf":
        return <WordToPdf />;

      // SEO & Internet
      case "robots-txt-generator":
        return <RobotsTxtGenerator />;
      case "meta-tag-generator":
        return <MetaTagGenerator />;
      case "my-ip-address":
        return <IpChecker />;
      case "website-status-checker":
        return <WebsiteStatusChecker />;

      // Fiverr Productivity Tools
      case "fiverr-message-checker":
        return <FiverrMessageChecker />;
      case "fiverr-deliverable-formatter":
        return <FiverrDeliverableFormatter />;

      default:
        return (
          <div className="p-12 text-center text-slate-500">
            Tool interface is undergoing maintenance.
          </div>
        );
    }
  };

  return <ToolLayout tool={tool}>{renderToolComponent()}</ToolLayout>;
}
