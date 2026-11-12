import { CategoryInfo, ToolCategory, ToolDefinition } from "./types";

export const CATEGORIES: CategoryInfo[] = [
  {
    id: "image",
    name: "Image Tools",
    slug: "image",
    description: "Compress, resize, crop, convert formats, and edit photos instantly in your browser.",
    icon: "Image",
    gradient: "from-purple-500 to-indigo-600",
  },
  {
    id: "pdf",
    name: "PDF Utilities",
    slug: "pdf",
    description: "Merge, split, rotate, convert, and inspect PDF documents with client-side privacy.",
    icon: "FileText",
    gradient: "from-rose-500 to-red-600",
  },
  {
    id: "calculators",
    name: "Calculators",
    slug: "calculators",
    description: "Fast, accurate financial, fitness, age, and mathematical calculation tools.",
    icon: "Calculator",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    id: "unit-converters",
    name: "Unit Converters",
    slug: "unit-converters",
    description: "Convert units of temperature, weight, length, digital storage, and speed.",
    icon: "ArrowRightLeft",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    id: "text",
    name: "Text Tools",
    slug: "text",
    description: "Analyze, format, clean, transform, and compare text strings and articles.",
    icon: "Type",
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    id: "developer",
    name: "Developer Tools",
    slug: "developer",
    description: "Essential utilities for coders: formatters, validators, hashers, and generators.",
    icon: "Code2",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    id: "generators",
    name: "Generators",
    slug: "generators",
    description: "Generate secure passwords, QR codes, UUIDs, dummy text, and barcodes.",
    icon: "Sparkles",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    id: "seo",
    name: "SEO Tools",
    slug: "seo",
    description: "Analyze meta tags, create robots.txt, preview search snippets, and optimize sites.",
    icon: "Search",
    gradient: "from-indigo-500 to-blue-600",
  },
  {
    id: "internet",
    name: "Internet Tools",
    slug: "internet",
    description: "Inspect network IP addresses, HTTP headers, DNS records, and website latency.",
    icon: "Globe",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    id: "fiverr",
    name: "Fiverr Productivity Tools",
    slug: "fiverr",
    description: "Policy compliance checking and professional deliverable formatting utilities for Fiverr freelancers.",
    icon: "ShieldAlert",
    gradient: "from-emerald-500 to-teal-600",
  },
];

export const TOOLS: ToolDefinition[] = [
  // --- IMAGE TOOLS ---
  {
    slug: "image-compressor",
    name: "Image Compressor",
    category: "image",
    description: "Reduce image file size significantly while preserving visual quality using high-performance client-side compression.",
    shortDescription: "Compress JPG, PNG, and WebP images up to 80% without noticeable quality loss.",
    keywords: ["compress image", "reduce photo size", "shrink picture", "image optimizer", "jpg compress", "png compress"],
    synonyms: ["make picture smaller", "reduce file size", "tiny png alternative", "photo optimizer"],
    icon: "Minimize2",
    status: "active",
    isPopular: true,
    isFeatured: true,
    badge: "Popular",
    howToSteps: [
      { title: "Upload Image", description: "Drag and drop or select an image from your computer (JPG, PNG, or WebP)." },
      { title: "Adjust Quality", description: "Use the quality slider to find your desired balance between file size and image crispness." },
      { title: "Download", description: "Compare the original and compressed sizes, then download your optimized image immediately." },
    ],
    faqs: [
      { question: "Are my images uploaded to any server?", answer: "No. All compression happens directly inside your browser using HTML5 Canvas. Your private photos never leave your device." },
      { question: "What image formats are supported?", answer: "Toolify Image Compressor supports JPG, JPEG, PNG, and WebP formats up to 25 MB." },
      { question: "How much file size can I save?", answer: "Depending on the original image and selected quality level, file size is typically reduced by 50% to 85%." },
    ],
  },
  {
    slug: "image-resizer",
    name: "Image Resizer",
    category: "image",
    description: "Resize photos to exact pixel dimensions or scale by percentage while maintaining aspect ratio and sharpness.",
    shortDescription: "Change image dimensions by exact pixels or percentage scale.",
    keywords: ["resize image", "change picture dimensions", "scale photo", "pixel resizer"],
    synonyms: ["change photo resolution", "make image wider", "resize for instagram"],
    icon: "Maximize2",
    status: "active",
    isPopular: true,
    howToSteps: [
      { title: "Choose Photo", description: "Select or drag any JPG, PNG, or WebP image into the tool." },
      { title: "Specify Dimensions", description: "Enter target width and height in pixels, or choose a percentage scaling factor." },
      { title: "Download Resized Image", description: "Preview the resized result and download in high quality." },
    ],
    faqs: [
      { question: "Can I lock the aspect ratio?", answer: "Yes! By default, the aspect ratio lock is enabled so your images won't look stretched or distorted." },
      { question: "Does resizing affect image clarity?", answer: "Toolify uses bicubic high-quality interpolation to keep downscaled and upscaled images as crisp as possible." },
    ],
  },
  {
    slug: "image-cropper",
    name: "Image Cropper",
    category: "image",
    description: "Crop unwanted areas from your photos with customizable aspect ratios like 1:1, 16:9, 4:3, or freeform cropping.",
    shortDescription: "Crop photos to exact ratios for avatars, banners, and social media.",
    keywords: ["crop photo", "cut image", "avatar crop", "photo trimmer"],
    synonyms: ["cut picture edges", "square photo", "make banner"],
    icon: "Crop",
    status: "active",
    howToSteps: [
      { title: "Upload Image", description: "Select the photo you wish to crop." },
      { title: "Adjust Selection", description: "Drag the bounding box or pick a preset aspect ratio (1:1, 16:9, 4:3, Freeform)." },
      { title: "Export Crop", description: "Click crop and download your cropped image." },
    ],
    faqs: [
      { question: "Can I crop circular avatars?", answer: "You can select the 1:1 square preset which matches circular profile pictures perfectly." },
      { question: "Is my original image preserved?", answer: "Yes, cropping creates a brand new image file; your original file on disk is untouched." },
    ],
  },
  {
    slug: "jpg-to-png",
    name: "JPG to PNG Converter",
    category: "image",
    description: "Convert JPG and JPEG images to lossless PNG format with transparency support.",
    shortDescription: "Convert lossy JPG files into transparent-ready PNG images.",
    keywords: ["jpg to png", "convert jpg", "jpeg to png"],
    synonyms: ["save jpg as png", "change jpg into png"],
    icon: "RefreshCw",
    status: "active",
    howToSteps: [
      { title: "Upload JPG", description: "Drop your JPG or JPEG file." },
      { title: "Convert", description: "Toolify renders the image data directly to lossless PNG." },
      { title: "Download PNG", description: "Save your converted file with a single click." },
    ],
    faqs: [
      { question: "Does converting JPG to PNG improve quality?", answer: "It prevents further compression loss when editing, though it cannot recover details already lost in the original JPG compression." },
    ],
  },
  {
    slug: "png-to-jpg",
    name: "PNG to JPG Converter",
    category: "image",
    description: "Convert PNG images into lightweight JPG format with adjustable quality settings and custom background color.",
    shortDescription: "Transform PNG graphics into compressed JPG images.",
    keywords: ["png to jpg", "convert png", "png to jpeg"],
    synonyms: ["change png into jpg", "save png as jpeg"],
    icon: "RefreshCw",
    status: "active",
    howToSteps: [
      { title: "Upload PNG", description: "Select your PNG graphic or photo." },
      { title: "Configure Quality", description: "Choose JPG compression quality and background fill color." },
      { title: "Download", description: "Download your lightweight JPG file." },
    ],
    faqs: [
      { question: "What happens to transparent backgrounds in PNG?", answer: "Because JPG does not support alpha transparency, transparent areas are filled with a clean white background." },
    ],
  },
  {
    slug: "webp-to-jpg",
    name: "WebP to JPG Converter",
    category: "image",
    description: "Convert modern WebP images into standard JPG files compatible with all devices and legacy software.",
    shortDescription: "Convert WebP images to universal JPG format.",
    keywords: ["webp to jpg", "convert webp", "webp to jpeg"],
    synonyms: ["save webp as jpg", "change webp file"],
    icon: "Repeat",
    status: "active",
    howToSteps: [
      { title: "Upload WebP", description: "Drop any WebP image." },
      { title: "Process", description: "The image is converted client-side into standard JPEG." },
      { title: "Download", description: "Save the converted JPG." },
    ],
    faqs: [
      { question: "Why convert WebP to JPG?", answer: "While WebP is great for web speed, some photo viewers, video editors, and legacy platforms still require JPG." },
    ],
  },
  {
    slug: "image-to-base64",
    name: "Image to Base64",
    category: "image",
    description: "Convert any image file into a Base64 encoded string or Data URI ready for HTML, CSS, and markdown embedding.",
    shortDescription: "Encode images into Base64 strings and CSS/HTML data URIs.",
    keywords: ["image to base64", "base64 image encoder", "data uri converter"],
    synonyms: ["embed image in css", "photo to base64 string"],
    icon: "Binary",
    status: "active",
    howToSteps: [
      { title: "Upload Image", description: "Select an image (PNG, JPG, SVG, WebP, GIF)." },
      { title: "Copy Base64", description: "Choose between raw Base64, Data URI, HTML img tag, or CSS background-image snippet." },
      { title: "Paste in Code", description: "Click Copy to Clipboard and paste directly into your project." },
    ],
    faqs: [
      { question: "What is an Image Data URI?", answer: "A Data URI allows you to embed image data directly into HTML or CSS code without making a separate HTTP request." },
    ],
  },
  {
    slug: "image-rotator",
    name: "Image Rotator & Flipper",
    category: "image",
    description: "Rotate images 90°, 180°, or 270° clockwise or counter-clockwise, and flip horizontally or vertically.",
    shortDescription: "Rotate or mirror your photos with one click.",
    keywords: ["rotate image", "flip photo", "mirror image", "turn picture 90 degrees"],
    synonyms: ["rotate photo clockwise", "flip image horizontally"],
    icon: "RotateCw",
    status: "active",
    howToSteps: [
      { title: "Upload Photo", description: "Drop the photo that needs orientation correction." },
      { title: "Rotate or Flip", description: "Use the 90° rotation and horizontal/vertical flip controls." },
      { title: "Download", description: "Download the corrected image in full resolution." },
    ],
    faqs: [
      { question: "Does rotating degrade quality?", answer: "No, rotation is applied losslessly onto canvas and exported in full pixel fidelity." },
    ],
  },
  {
    slug: "image-color-picker",
    name: "Image Color Picker",
    category: "image",
    description: "Inspect any uploaded image to sample colors from specific pixels and extract dominant color palettes in HEX, RGB, and HSL.",
    shortDescription: "Sample pixel colors and extract palettes from any photo.",
    keywords: ["color picker from image", "extract colors", "eyedropper", "hex color finder"],
    synonyms: ["find hex code from image", "photo palette extractor"],
    icon: "Pipette",
    status: "active",
    howToSteps: [
      { title: "Load Image", description: "Upload any screenshot or photo." },
      { title: "Hover & Click", description: "Hover over the image to preview pixel colors, and click to capture." },
      { title: "Copy Values", description: "Copy HEX, RGB, or HSL color codes with a single click." },
    ],
    faqs: [
      { question: "Can I inspect zoomed-in pixels?", answer: "Yes, the tool includes a precision magnifier lens so you can target individual pixels effortlessly." },
    ],
  },
  {
    slug: "background-remover",
    name: "Background Remover",
    category: "image",
    description: "Remove image backgrounds to create clean transparent PNG cutouts using genuine AI edge-detection processing.",
    shortDescription: "Create transparent background PNGs with AI precision.",
    keywords: ["remove background", "transparent png", "background eraser", "cut out photo"],
    synonyms: ["removebg alternative", "make transparent background", "delete photo background"],
    icon: "Eraser",
    status: "active",
    isFeatured: true,
    isPopular: true,
    badge: "AI Powered",
    howToSteps: [
      { title: "Upload Subject", description: "Upload a portrait, product photo, or object with reasonable contrast." },
      { title: "Automatic Processing", description: "The neural network analyzes contours and isolates the primary foreground subject." },
      { title: "Download PNG", description: "Download your transparent PNG with smooth antialiased edges." },
    ],
    faqs: [
      { question: "Is this genuine background removal?", answer: "Yes! We run real edge extraction and color segmentation. You can also provide your own Remove.bg or HuggingFace API key in the settings for studio-grade cloud removal." },
      { question: "What images work best?", answer: "Photos with clear distinction between foreground subject and background (portraits, products, logos) yield the cleanest results." },
    ],
  },

  // --- PDF TOOLS ---
  {
    slug: "merge-pdf",
    name: "Merge PDF",
    category: "pdf",
    description: "Combine multiple PDF documents into a single organized file in seconds directly in your browser.",
    shortDescription: "Combine multiple PDF files into one document in your chosen order.",
    keywords: ["merge pdf", "combine pdfs", "join pdf files", "pdf binder"],
    synonyms: ["put pdfs together", "combine two pdf documents"],
    icon: "Layers",
    status: "active",
    isPopular: true,
    isFeatured: true,
    badge: "Essential",
    howToSteps: [
      { title: "Upload PDFs", description: "Select or drop two or more PDF files." },
      { title: "Reorder Files", description: "Drag and drop or use the arrow controls to sort documents into the desired sequence." },
      { title: "Merge & Download", description: "Click 'Merge PDFs' and download your combined document instantly." },
    ],
    faqs: [
      { question: "Are my confidential PDFs safe?", answer: "100% safe. Toolify uses pdf-lib to merge documents directly on your computer. Files never touch a remote server." },
      { question: "Is there a limit on how many PDFs I can merge?", answer: "You can merge as many documents as your device memory can handle (tested comfortably up to 50+ files)." },
    ],
  },
  {
    slug: "split-pdf",
    name: "Split PDF",
    category: "pdf",
    description: "Extract specific pages or page ranges from a PDF document to create a new customized PDF.",
    shortDescription: "Extract individual pages or page ranges from any PDF document.",
    keywords: ["split pdf", "extract pdf pages", "separate pdf", "pdf page cutter"],
    synonyms: ["take pages out of pdf", "divide pdf into parts"],
    icon: "Scissors",
    status: "active",
    isPopular: true,
    howToSteps: [
      { title: "Upload Document", description: "Select the PDF file you wish to split." },
      { title: "Specify Page Range", description: "Enter page ranges such as '1-3, 5, 8-10' or select all pages." },
      { title: "Export Extracted PDF", description: "Download the newly created PDF containing only your chosen pages." },
    ],
    faqs: [
      { question: "How do I specify pages to extract?", answer: "Use comma-separated numbers and hyphens, e.g. '1-3, 5, 7-9'." },
    ],
  },
  {
    slug: "rotate-pdf",
    name: "Rotate PDF",
    category: "pdf",
    description: "Rotate misaligned PDF pages by 90°, 180°, or 270° and save the corrected document permanently.",
    shortDescription: "Rotate individual or all pages of a PDF document.",
    keywords: ["rotate pdf", "turn pdf pages", "orient pdf"],
    synonyms: ["flip upside down pdf", "turn pdf sideways"],
    icon: "RotateCw",
    status: "active",
    howToSteps: [
      { title: "Upload PDF", description: "Select the PDF file with incorrect page orientation." },
      { title: "Select Rotation", description: "Rotate all pages 90° clockwise, counter-clockwise, or 180°." },
      { title: "Save & Download", description: "Download the permanently re-oriented PDF document." },
    ],
    faqs: [
      { question: "Does this permanently save the rotation?", answer: "Yes, the rotation metadata is written directly into the PDF structure so it displays properly in every reader." },
    ],
  },
  {
    slug: "jpg-to-pdf",
    name: "JPG to PDF Converter",
    category: "pdf",
    description: "Convert photos and images (JPG, PNG) into a neat, standardized multi-page PDF document.",
    shortDescription: "Convert single or multiple images into a clean PDF document.",
    keywords: ["jpg to pdf", "convert images to pdf", "photos to pdf"],
    synonyms: ["make pdf from pictures", "turn photos into pdf"],
    icon: "FilePlus",
    status: "active",
    isPopular: true,
    howToSteps: [
      { title: "Upload Images", description: "Select one or more photos from your device." },
      { title: "Arrange Pages", description: "Reorder images so they appear in your preferred sequence." },
      { title: "Generate PDF", description: "Click convert to compile them into a unified PDF document." },
    ],
    faqs: [
      { question: "Can I adjust the page size?", answer: "Yes, pages automatically adapt to match image dimensions or standardize to A4." },
    ],
  },
  {
    slug: "pdf-metadata-viewer",
    name: "PDF Metadata Viewer",
    category: "pdf",
    description: "Inspect hidden metadata in PDF documents including Title, Author, Subject, Creator, Producer, Creation Date, and page counts.",
    shortDescription: "Inspect internal document metadata, page counts, and producer details.",
    keywords: ["pdf metadata", "pdf inspector", "pdf author", "pdf properties"],
    synonyms: ["check who created pdf", "view pdf info"],
    icon: "Info",
    status: "active",
    howToSteps: [
      { title: "Select PDF", description: "Drop any PDF document." },
      { title: "View Information", description: "Examine complete document properties, creation dates, and encryption flags." },
    ],
    faqs: [
      { question: "Can this detect PDF encryption?", answer: "Yes, it reports whether the document has password protection or restricted permissions." },
    ],
  },
  {
    slug: "word-to-pdf",
    name: "Word to PDF Converter",
    category: "pdf",
    description: "Convert Word documents (.docx, .doc, text) into standard PDF files with reliable client-side document processing.",
    shortDescription: "Convert DOCX and Word documents into universal PDF format.",
    keywords: ["word to pdf", "docx to pdf", "doc to pdf converter"],
    synonyms: ["convert doc to pdf", "save word doc as pdf"],
    icon: "FileText",
    status: "active",
    isPopular: true,
    howToSteps: [
      { title: "Upload Word File", description: "Select your .docx document." },
      { title: "Review & Format", description: "Toolify parses document paragraphs, headings, and structure." },
      { title: "Download PDF", description: "Export the clean converted PDF." },
    ],
    faqs: [
      { question: "Does this preserve all formatting?", answer: "Toolify converts text, headings, tables, and spacing into standard PDF coordinates. Complex specialized macro scripts may require standard Microsoft Word." },
    ],
  },

  // --- CALCULATORS ---
  {
    slug: "bmi-calculator",
    name: "BMI Calculator",
    category: "calculators",
    description: "Calculate your Body Mass Index (BMI), determine your weight category, and view healthy weight ranges with metric and imperial units.",
    shortDescription: "Calculate your Body Mass Index with metric (kg/cm) or imperial (lbs/ft) units.",
    keywords: ["bmi calculator", "body mass index", "healthy weight", "obesity scale"],
    synonyms: ["check my bmi", "ideal weight calculator", "am i overweight"],
    icon: "Activity",
    status: "active",
    isPopular: true,
    isFeatured: true,
    badge: "Popular",
    howToSteps: [
      { title: "Select Unit System", description: "Choose Metric (cm / kg) or Imperial (feet, inches / lbs)." },
      { title: "Enter Measurements", description: "Input your height and current weight." },
      { title: "View Analysis", description: "Get your exact BMI number, category classification, and healthy range." },
    ],
    faqs: [
      { question: "What is a healthy BMI?", answer: "According to the World Health Organization (WHO), a BMI between 18.5 and 24.9 is classified as normal/healthy weight." },
      { question: "Is BMI a medical diagnosis?", answer: "No. BMI is a general screening indicator. It does not measure body fat percentage directly and does not account for muscle mass or bone density." },
    ],
  },
  {
    slug: "age-calculator",
    name: "Age Calculator",
    category: "calculators",
    description: "Calculate your exact age in years, months, weeks, days, hours, and minutes, plus a countdown to your next birthday.",
    shortDescription: "Find your exact age down to days and see your next birthday countdown.",
    keywords: ["age calculator", "how old am i", "date of birth calculator", "birthday countdown"],
    synonyms: ["calculate my age", "how many days old am i"],
    icon: "Calendar",
    status: "active",
    isPopular: true,
    howToSteps: [
      { title: "Enter Date of Birth", description: "Select your birth month, day, and year." },
      { title: "Choose Reference Date", description: "Defaults to today, or pick any past or future date." },
      { title: "View Detailed Breakdown", description: "See your age in years/months/days, total days lived, and next birthday." },
    ],
    faqs: [
      { question: "Does this calculator account for leap years?", answer: "Yes, all leap years and different calendar month lengths are calculated with 100% precision." },
    ],
  },
  {
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    category: "calculators",
    description: "Solve all standard percentage equations: find X% of Y, calculate what percentage X is of Y, and compute percentage increase or decrease.",
    shortDescription: "Quickly calculate percentages, discounts, and percentage change.",
    keywords: ["percentage calculator", "percent math", "calculate percent change", "discount percentage"],
    synonyms: ["what is 20 percent of", "calculate percent increase"],
    icon: "Percent",
    status: "active",
    isPopular: true,
    howToSteps: [
      { title: "Select Calculation Mode", description: "Choose percentage of a number, percentage difference, or proportion." },
      { title: "Input Numbers", description: "Enter your values in the input boxes." },
      { title: "Instant Result", description: "View the calculated outcome along with the exact formula used." },
    ],
    faqs: [
      { question: "How is percentage increase calculated?", answer: "Percentage increase = ((New Value - Old Value) / Old Value) * 100." },
    ],
  },
  {
    slug: "loan-calculator",
    name: "Loan & Mortgage Calculator",
    category: "calculators",
    description: "Calculate monthly loan payments, total interest paid, and total cost of borrowing with interactive interest and term sliders.",
    shortDescription: "Calculate monthly payments and total interest for loans and mortgages.",
    keywords: ["loan calculator", "mortgage calculator", "monthly payment", "emi calculator", "interest rate"],
    synonyms: ["calculate car loan", "how much is mortgage payment"],
    icon: "Coins",
    status: "active",
    howToSteps: [
      { title: "Enter Principal", description: "Type the total amount you wish to borrow." },
      { title: "Enter Interest & Term", description: "Input the annual interest rate (APR) and loan duration in years." },
      { title: "Inspect Amortization", description: "Review your monthly installment, principal portion, and total interest cost." },
    ],
    faqs: [
      { question: "What formula does this use?", answer: "It uses standard compounding amortization: P * (r(1+r)^n) / ((1+r)^n - 1)." },
    ],
  },
  {
    slug: "discount-calculator",
    name: "Discount Calculator",
    category: "calculators",
    description: "Calculate final sale price, money saved, and applicable sales tax for shopping discounts and markdowns.",
    shortDescription: "Find the final price and savings after discount and taxes.",
    keywords: ["discount calculator", "sale price", "percent off calculator", "savings calculator"],
    synonyms: ["how much is 30 percent off", "sale discount"],
    icon: "Tag",
    status: "active",
    howToSteps: [
      { title: "Enter Original Price", description: "Input the item's sticker price." },
      { title: "Specify Discount", description: "Enter the discount percentage (e.g., 25% off)." },
      { title: "See Savings", description: "Get the exact final price and total money saved." },
    ],
    faqs: [
      { question: "Can I include sales tax?", answer: "Yes, you can toggle additional sales tax to calculate your exact checkout total." },
    ],
  },

  // --- UNIT CONVERTERS ---
  {
    slug: "celsius-to-fahrenheit",
    name: "Temperature Converter",
    category: "unit-converters",
    description: "Convert instantly between Celsius (°C), Fahrenheit (°F), and Kelvin (K) with bidirectional live updating.",
    shortDescription: "Convert between Celsius, Fahrenheit, and Kelvin temperature scales.",
    keywords: ["celsius to fahrenheit", "fahrenheit to celsius", "temperature converter", "kelvin converter"],
    synonyms: ["temperature", "how hot is 30 celsius", "c to f conversion"],
    icon: "Thermometer",
    status: "active",
    isPopular: true,
    howToSteps: [
      { title: "Enter Temperature", description: "Type a value into Celsius, Fahrenheit, or Kelvin." },
      { title: "Instant Conversion", description: "All other temperature scales update synchronously in real-time." },
    ],
    faqs: [
      { question: "What is the formula for Celsius to Fahrenheit?", answer: "°F = (°C * 9/5) + 32." },
    ],
  },
  {
    slug: "cm-to-feet",
    name: "Length & Distance Converter",
    category: "unit-converters",
    description: "Convert between Centimeters, Feet, Inches, Meters, Kilometers, and Miles with high scientific precision.",
    shortDescription: "Convert height and distance across metric and imperial systems.",
    keywords: ["cm to feet", "feet to cm", "inches to cm", "meters to feet", "length converter"],
    synonyms: ["convert height", "distance converter", "how tall in feet"],
    icon: "Ruler",
    status: "active",
    isPopular: true,
    howToSteps: [
      { title: "Select Source & Target", description: "Choose your units (e.g. Centimeters to Feet & Inches)." },
      { title: "Type Number", description: "Enter the measurement value." },
      { title: "Copy Result", description: "View the exact converted output with unit formatting." },
    ],
    faqs: [
      { question: "How many centimeters in an inch?", answer: "1 inch is officially defined as exactly 2.54 centimeters." },
    ],
  },
  {
    slug: "kg-to-pounds",
    name: "Weight & Mass Converter",
    category: "unit-converters",
    description: "Convert seamlessly between Kilograms (kg), Pounds (lbs), Grams (g), and Ounces (oz).",
    shortDescription: "Convert weight between metric kilograms and imperial pounds.",
    keywords: ["kg to pounds", "pounds to kg", "weight converter", "grams to ounces"],
    synonyms: ["convert mass", "how many pounds is 70 kg"],
    icon: "Scale",
    status: "active",
    howToSteps: [
      { title: "Choose Units", description: "Select Kilograms, Pounds, Grams, or Ounces." },
      { title: "Enter Weight", description: "Type any positive numerical value." },
      { title: "View Conversion", description: "See immediate accurate results across all units." },
    ],
    faqs: [
      { question: "What is the conversion factor?", answer: "1 Kilogram equals approximately 2.20462 pounds." },
    ],
  },
  {
    slug: "mb-to-gb",
    name: "Digital Storage Converter",
    category: "unit-converters",
    description: "Convert data storage sizes across Bytes, Kilobytes (KB), Megabytes (MB), Gigabytes (GB), and Terabytes (TB) using binary (1024) or decimal (1000) standards.",
    shortDescription: "Convert digital storage units between KB, MB, GB, and TB.",
    keywords: ["mb to gb", "gb to mb", "data storage converter", "bytes converter"],
    synonyms: ["how many mb in a gb", "file size converter"],
    icon: "HardDrive",
    status: "active",
    howToSteps: [
      { title: "Input File Size", description: "Enter any digital storage quantity." },
      { title: "Toggle Standard", description: "Switch between Binary (1024 bytes) and Decimal (1000 bytes) standards." },
      { title: "Review Sizes", description: "Read equivalent values in Bytes, KB, MB, GB, and TB." },
    ],
    faqs: [
      { question: "Is 1 GB equal to 1000 MB or 1024 MB?", answer: "In operating systems like Windows, 1 GB (GiB) is 1,024 MB. Hard drive manufacturers often use the decimal 1,000 MB standard." },
    ],
  },

  // --- TEXT TOOLS ---
  {
    slug: "word-counter",
    name: "Word & Character Counter",
    category: "text",
    description: "Analyze your text in real time with detailed counts of words, characters (with and without spaces), sentences, paragraphs, and estimated reading and speaking time.",
    shortDescription: "Real-time statistics for words, characters, reading time, and sentences.",
    keywords: ["word counter", "character counter", "text length", "reading time calculator", "letter count"],
    synonyms: ["count words in essay", "how many characters in text", "twitter character limit checker"],
    icon: "FileSearch",
    status: "active",
    isPopular: true,
    isFeatured: true,
    badge: "Popular",
    howToSteps: [
      { title: "Type or Paste", description: "Paste or type your text into the interactive editor." },
      { title: "Live Metrics", description: "Watch words, characters, sentences, and reading time update instantaneously." },
      { title: "Copy or Clear", description: "Use quick action buttons to copy formatted statistics or clean the buffer." },
    ],
    faqs: [
      { question: "How is reading time estimated?", answer: "It uses the standard human silent reading speed benchmark of 200 words per minute." },
      { question: "Does it count spaces as characters?", answer: "The tool presents both metrics: 'Characters with spaces' and 'Characters without spaces'." },
    ],
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    category: "text",
    description: "Transform text casing with one click into UPPERCASE, lowercase, Title Case, Sentence case, camelCase, kebab-case, snake_case, and Alternating Case.",
    shortDescription: "Convert text into UPPERCASE, lowercase, Title Case, camelCase, and more.",
    keywords: ["case converter", "uppercase to lowercase", "title case", "camelcase generator", "slug casing"],
    synonyms: ["capitalize all letters", "make text lowercase", "fix capitalization"],
    icon: "CaseSensitive",
    status: "active",
    isPopular: true,
    howToSteps: [
      { title: "Paste Text", description: "Input text in any casing into the box." },
      { title: "Select Case Style", description: "Click your desired casing button (e.g., Title Case, UPPERCASE, camelCase)." },
      { title: "Copy Result", description: "Click Copy to Clipboard and use in your document." },
    ],
    faqs: [
      { question: "What is Title Case?", answer: "Title Case capitalizes the first letter of major words while keeping articles, prepositions, and conjunctions lowercase." },
    ],
  },
  {
    slug: "text-diff-checker",
    name: "Text Diff Checker",
    category: "text",
    description: "Compare two text snippets side-by-side or line-by-line to clearly highlight differences, additions, and deletions with color-coded diff markers.",
    shortDescription: "Compare two texts to identify differences, additions, and removals.",
    keywords: ["text diff", "diff checker", "compare text", "find differences in text"],
    synonyms: ["check text changes", "code comparison", "plagiarism text compare"],
    icon: "GitCompare",
    status: "active",
    isFeatured: true,
    howToSteps: [
      { title: "Enter Original & Modified Text", description: "Paste the original version on the left and the updated version on the right." },
      { title: "Compare", description: "Click 'Find Differences' to view the color-coded diff analysis." },
      { title: "Review Highlights", description: "Additions are highlighted in green, deletions in red, and unchanged lines in neutral gray." },
    ],
    faqs: [
      { question: "Is this tool safe for confidential code?", answer: "Yes, the comparison algorithm executes purely in client memory without sending snippets anywhere." },
    ],
  },
  {
    slug: "text-to-slug",
    name: "Text to Slug Converter",
    category: "text",
    description: "Convert titles, headlines, and phrases into clean, URL-friendly, SEO-optimized kebab-case slugs.",
    shortDescription: "Generate clean, URL-friendly slugs from any title or text.",
    keywords: ["text to slug", "slug generator", "url slugify", "seo slug creator"],
    synonyms: ["make url from title", "kebab-case generator"],
    icon: "Link2",
    status: "active",
    howToSteps: [
      { title: "Type Title", description: "Type or paste your article or page title." },
      { title: "Automatic Slugging", description: "Special characters, punctuation, and extra spaces are replaced with clean hyphens." },
      { title: "Copy URL Slug", description: "Copy your SEO-ready slug." },
    ],
    faqs: [
      { question: "Does it remove accents and emojis?", answer: "Yes, accented characters (like é, ü, ñ) are normalized to their ASCII equivalents (e, u, n) and emojis/symbols are stripped." },
    ],
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    category: "text",
    description: "Generate placeholder dummy text by words, sentences, or paragraphs with options for standard Cicero Latin text.",
    shortDescription: "Generate customizable dummy placeholder text for layouts and designs.",
    keywords: ["lorem ipsum generator", "dummy text", "placeholder text", "filler text"],
    synonyms: ["fake text generator", "sample text for mockups"],
    icon: "AlignLeft",
    status: "active",
    howToSteps: [
      { title: "Choose Quantity", description: "Select whether you want Paragraphs, Sentences, or Words." },
      { title: "Generate", description: "Click generate to create realistic placeholder copy." },
      { title: "Copy", description: "Copy with one click into your mockup or layout." },
    ],
    faqs: [
      { question: "Where does Lorem Ipsum come from?", answer: "It originates from sections 1.10.32 and 1.10.33 of Cicero's 'De Finibus Bonorum et Malorum' written in 45 BC." },
    ],
  },

  // --- DEVELOPER TOOLS ---
  {
    slug: "json-formatter",
    name: "JSON Formatter & Validator",
    category: "developer",
    description: "Format, validate, beautify, and inspect JSON payloads with syntax error detection, line indicators, and configurable indentation.",
    shortDescription: "Format, validate, and beautify JSON code with precise error detection.",
    keywords: ["json formatter", "json validator", "beautify json", "json parser", "json linter"],
    synonyms: ["format json payload", "validate json string", "fix json syntax"],
    icon: "Code",
    status: "active",
    isPopular: true,
    isFeatured: true,
    badge: "Popular",
    howToSteps: [
      { title: "Input JSON", description: "Paste raw or minified JSON text into the editor." },
      { title: "Choose Indentation", description: "Pick 2 spaces, 4 spaces, or tab indentation." },
      { title: "Format & Inspect", description: "Click 'Format JSON' to beautify, or review highlighted syntax errors." },
    ],
    faqs: [
      { question: "What happens if my JSON is invalid?", answer: "Toolify points out the exact error message and character position so you can pinpoint missing quotes, commas, or brackets." },
      { question: "Can I minify JSON?", answer: "Yes! Click the 'Minify' button to strip all whitespace for production payloads." },
    ],
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    category: "developer",
    description: "Create cryptographically secure, random passwords with custom lengths, uppercase/lowercase letters, numbers, symbols, and entropy strength analysis.",
    shortDescription: "Generate strong, unhackable passwords with custom security rules.",
    keywords: ["password generator", "random password", "secure password", "strong password maker"],
    synonyms: ["create safe password", "generate wifi password"],
    icon: "KeyRound",
    status: "active",
    isPopular: true,
    badge: "Essential",
    howToSteps: [
      { title: "Set Desired Length", description: "Adjust the length slider (recommended: 16+ characters)." },
      { title: "Toggle Characters", description: "Select your desired character sets: Uppercase, Lowercase, Numbers, and Special Symbols." },
      { title: "Generate & Copy", description: "Click generate and copy your secure password directly to your clipboard." },
    ],
    faqs: [
      { question: "How secure is this generator?", answer: "Passwords are generated using the browser's native `window.crypto.getRandomValues()` API, which is cryptographically secure." },
      { question: "Are generated passwords logged?", answer: "Never. Passwords are generated strictly in memory on your device and are never sent to any server." },
    ],
  },
  {
    slug: "qr-code-generator",
    name: "QR Code Generator",
    category: "developer",
    description: "Generate high-resolution QR codes for websites, plain text, Wi-Fi credentials, or email links with custom colors and instant PNG/SVG download.",
    shortDescription: "Create custom QR codes for URLs, text, and Wi-Fi networks.",
    keywords: ["qr code generator", "create qr code", "make qr", "custom qr code"],
    synonyms: ["barcode for website", "scannable code maker"],
    icon: "QrCode",
    status: "active",
    isPopular: true,
    isFeatured: true,
    badge: "Popular",
    howToSteps: [
      { title: "Enter Content", description: "Type any URL, text message, or contact details." },
      { title: "Customize Appearance", description: "Pick custom foreground and background colors." },
      { title: "Download QR Code", description: "Download as high-res PNG or vector SVG ready for print and screen." },
    ],
    faqs: [
      { question: "Do these QR codes expire?", answer: "No. These are static QR codes encoding the exact data directly into the pixel pattern. They never expire." },
    ],
  },
  {
    slug: "uuid-generator",
    name: "UUID / GUID Generator",
    category: "developer",
    description: "Generate universally unique identifiers (UUID v4) individually or in bulk with options for uppercase and hyphens.",
    shortDescription: "Generate standard RFC-4122 Version 4 UUIDs and GUIDs.",
    keywords: ["uuid generator", "guid generator", "random uuid", "uuid v4"],
    synonyms: ["create unique id", "generate guid for database"],
    icon: "Fingerprint",
    status: "active",
    howToSteps: [
      { title: "Select Quantity", description: "Choose how many UUIDs to generate (from 1 to 100)." },
      { title: "Format Options", description: "Toggle hyphens or uppercase formatting as needed." },
      { title: "Copy All", description: "Copy generated UUIDs with a single click." },
    ],
    faqs: [
      { question: "What version of UUID is generated?", answer: "Toolify generates RFC-4122 compliant Version 4 UUIDs based on cryptographic pseudorandom numbers." },
    ],
  },
  {
    slug: "base64-encoder-decoder",
    name: "Base64 Encoder & Decoder",
    category: "developer",
    description: "Encode plain text to standard Base64 representation or decode Base64 strings back to UTF-8 readable text.",
    shortDescription: "Convert text to Base64 format and decode Base64 back to plain text.",
    keywords: ["base64 encoder", "base64 decoder", "base64 converter", "base64 string"],
    synonyms: ["encode to base64", "decode base64 text"],
    icon: "Binary",
    status: "active",
    howToSteps: [
      { title: "Select Mode", description: "Switch between Encode and Decode tabs." },
      { title: "Input Text", description: "Paste your text or Base64 string." },
      { title: "Copy Output", description: "Copy the processed string immediately." },
    ],
    faqs: [
      { question: "Does this support non-Latin UTF-8 characters?", answer: "Yes, our implementation handles full UTF-8 Unicode including accents, special characters, and emojis without corruption." },
    ],
  },
  {
    slug: "hash-generator",
    name: "Hash Generator (MD5, SHA-256)",
    category: "developer",
    description: "Generate cryptographic checksums and hashes including SHA-1, SHA-256, SHA-512, and MD5 for text and verification.",
    shortDescription: "Generate secure cryptographic hashes (MD5, SHA-1, SHA-256, SHA-512).",
    keywords: ["hash generator", "sha256 generator", "md5 generator", "checksum generator"],
    synonyms: ["calculate sha256 checksum", "hash string"],
    icon: "Hash",
    status: "active",
    howToSteps: [
      { title: "Type Text", description: "Type or paste any string into the input area." },
      { title: "Inspect Hashes", description: "View SHA-256, SHA-512, SHA-1, and MD5 hashes computed simultaneously." },
      { title: "Copy Hash", description: "Copy any specific hash with one click." },
    ],
    faqs: [
      { question: "Is hashing reversible?", answer: "No, cryptographic hashing is a one-way mathematical function designed to produce fixed-length digests." },
    ],
  },
  {
    slug: "unix-timestamp-converter",
    name: "Unix Timestamp Converter",
    category: "developer",
    description: "Convert Unix epoch timestamps (seconds and milliseconds) to human-readable dates and convert standard dates into timestamps.",
    shortDescription: "Convert epoch timestamps to readable dates and vice-versa.",
    keywords: ["unix timestamp converter", "epoch converter", "timestamp to date", "current unix time"],
    synonyms: ["epoch time", "convert seconds to date"],
    icon: "Clock",
    status: "active",
    howToSteps: [
      { title: "Enter Timestamp or Date", description: "Input a numeric timestamp or choose a calendar date." },
      { title: "Read Conversion", description: "See human-readable UTC time, your local timezone time, and relative duration." },
    ],
    faqs: [
      { question: "What is Unix time?", answer: "Unix time is the number of seconds that have elapsed since the Unix Epoch on January 1, 1970 00:00:00 UTC." },
    ],
  },
  {
    slug: "regex-tester",
    name: "Regular Expression Tester",
    category: "developer",
    description: "Test and debug JavaScript regular expressions with real-time match highlighting, capture group extraction, and flag toggles (g, i, m, s).",
    shortDescription: "Test regular expressions in real-time with visual match highlighting.",
    keywords: ["regex tester", "regular expression", "regex checker", "test regex online"],
    synonyms: ["test regex pattern", "regex match highlighter"],
    icon: "Terminal",
    status: "active",
    howToSteps: [
      { title: "Enter Regex", description: "Type your regular expression pattern and toggle flags (global, case-insensitive, multiline)." },
      { title: "Enter Test Text", description: "Type or paste the sample text you wish to match." },
      { title: "Inspect Matches", description: "View highlighted matches and captured groups instantly." },
    ],
    faqs: [
      { question: "Which Regex flavor does this use?", answer: "It uses the native ECMAScript (JavaScript) regular expression engine supported by all modern browsers." },
    ],
  },

  // --- SEO & INTERNET TOOLS ---
  {
    slug: "robots-txt-generator",
    name: "Robots.txt Generator",
    category: "seo",
    description: "Create an optimized, syntax-correct robots.txt file to guide search engine web crawlers with custom user-agents, disallows, and sitemap URLs.",
    shortDescription: "Build a valid robots.txt file to guide search crawlers and protect private pages.",
    keywords: ["robots.txt generator", "create robots.txt", "seo crawler rules", "disallow pages"],
    synonyms: ["make robots file", "block google from crawling"],
    icon: "Bot",
    status: "active",
    howToSteps: [
      { title: "Specify Sitemap", description: "Enter your full sitemap XML URL (e.g., https://example.com/sitemap.xml)." },
      { title: "Configure Crawler Rules", description: "Allow or disallow paths for Googlebot, Bingbot, or all user agents (*)." },
      { title: "Download robots.txt", description: "Copy or download the file and place it in your website root." },
    ],
    faqs: [
      { question: "Where should robots.txt be placed?", answer: "It must always be placed at the root of your domain: `https://yourdomain.com/robots.txt`." },
    ],
  },
  {
    slug: "meta-tag-generator",
    name: "Meta Tag & Open Graph Generator",
    category: "seo",
    description: "Create complete SEO meta tags, Open Graph (Facebook), and Twitter Card markup with an interactive live snippet preview.",
    shortDescription: "Generate SEO meta tags and preview social cards for Twitter and Facebook.",
    keywords: ["meta tag generator", "open graph generator", "twitter card generator", "seo tags"],
    synonyms: ["social preview generator", "create meta tags for website"],
    icon: "Share2",
    status: "active",
    isPopular: true,
    howToSteps: [
      { title: "Enter Site Details", description: "Input page title, description, URL, and social share image URL." },
      { title: "Preview Live Cards", description: "See realistic mockups of Google Search, Twitter, and Facebook shares." },
      { title: "Copy HTML Code", description: "Copy the clean `<head>` HTML tags directly into your site." },
    ],
    faqs: [
      { question: "Why are Open Graph tags important?", answer: "Open Graph tags control how your links look when shared on iMessage, Slack, LinkedIn, Twitter, and Facebook, greatly improving click-through rates." },
    ],
  },
  {
    slug: "my-ip-address",
    name: "My IP Address & Network Inspector",
    category: "internet",
    description: "Find your public IP address, user-agent details, connection protocol, and inspect browser headers with security analysis.",
    shortDescription: "Check your public IP address, browser headers, and client network details.",
    keywords: ["my ip address", "what is my ip", "ip checker", "network headers inspector"],
    synonyms: ["show my public ip", "check client ip"],
    icon: "Network",
    status: "active",
    howToSteps: [
      { title: "Open Tool", description: "Your public IP address and connection details load instantly." },
      { title: "Inspect Headers", description: "Review HTTP headers, user agent, and detected country info." },
    ],
    faqs: [
      { question: "Is my IP address saved?", answer: "No. IP queries are processed ephemerally to display your connection status and are not stored in any database." },
    ],
  },
  {
    slug: "website-status-checker",
    name: "Website Status & Response Time Checker",
    category: "internet",
    description: "Check if a website is up or down, verify HTTP status response codes (200, 301, 404, 500), and test server response latency with SSRF protection.",
    shortDescription: "Check if a website is online and measure server response latency.",
    keywords: ["website status checker", "is it down", "check website response time", "http status checker"],
    synonyms: ["check if website is working", "ping website", "server uptime check"],
    icon: "Wifi",
    status: "active",
    howToSteps: [
      { title: "Enter Website URL", description: "Type any public domain or URL (e.g. https://google.com)." },
      { title: "Test Connection", description: "Click 'Check Status' to initiate a safe server probe." },
      { title: "Review Report", description: "View HTTP status code, response time in milliseconds, and headers." },
    ],
    faqs: [
      { question: "How does the checker prevent SSRF attacks?", answer: "Our backend strictly verifies that the target domain resolves to a public routable IP address, rejecting private IP ranges (127.0.0.1, 192.168.x, 10.x, AWS metadata)." },
    ],
  },

  // --- FIVERR PRODUCTIVITY TOOLS ---
  {
    slug: "fiverr-message-checker",
    name: "Fiverr Message Compliance Checker",
    category: "fiverr",
    description: "Scan messages for restricted contact information, external payment terms, and Terms of Service violations before sending them to Fiverr buyers.",
    shortDescription: "Check Fiverr messages for restricted words, external contacts, and TOS compliance.",
    keywords: ["fiverr message checker", "fiverr compliance", "fiverr tos checker", "avoid fiverr warning", "safe fiverr message", "fiverr contact terms"],
    synonyms: ["can i send email on fiverr", "fiverr warning words", "fiverr word checker", "check fiverr message safety"],
    icon: "ShieldAlert",
    status: "active",
    isPopular: true,
    isFeatured: true,
    badge: "Fiverr Safety",
    howToSteps: [
      { title: "Paste Your Message", description: "Type or paste your draft message into the editor." },
      { title: "Review Flags & Explanations", description: "Inspect highlighted sensitive terms and read clear policy explanations." },
      { title: "Apply Compliant Alternatives", description: "Use suggested policy-friendly wording that keeps your intended meaning without violating rules, then copy." },
    ],
    faqs: [
      { question: "Does this tool bypass or trick Fiverr's algorithm?", answer: "No. This tool strictly helps you follow Fiverr's Terms of Service. It never inserts special characters, spaces, or obfuscation tricks that could get your account banned." },
      { question: "What sensitive phrases does it scan for?", answer: "It scans for external contact details (email, WhatsApp, phone numbers, Skype, Discord), off-platform payment methods (PayPal, bank transfer, crypto), review manipulation (asking for 5 stars), and academic policy violations." },
      { question: "Is my message stored on any server?", answer: "No. All text scanning and analysis happens 100% locally in your web browser. Your private buyer conversations never leave your device." },
    ],
  },
  {
    slug: "fiverr-deliverable-formatter",
    name: "Fiverr Deliverable Formatter",
    category: "fiverr",
    description: "Format messy multi-line notes into clean, professional custom offer deliverables using Roman numerals (I-3999), bullet points, numbers, or hyphens.",
    shortDescription: "Automatically format custom-offer deliverables into clean, professional lists.",
    keywords: ["fiverr deliverable formatter", "custom offer formatter", "fiverr scope list", "roman numeral formatter", "fiverr proposal list"],
    synonyms: ["format custom offer", "fiverr bullet points", "numbering for fiverr offer", "deliverables list maker"],
    icon: "ListOrdered",
    status: "active",
    isPopular: true,
    badge: "Custom Offers",
    howToSteps: [
      { title: "Paste Deliverables", description: "Paste your raw deliverables or scope of work line by line into the input area." },
      { title: "Select Formatting Style", description: "Choose between Roman Numerals (I, II, III), Hyphen Prefix, Standard Numbering (1, 2, 3), or Bullet Points." },
      { title: "Copy Polished Output", description: "Review the instant live preview and copy the formatted deliverables directly into your Fiverr offer." },
    ],
    faqs: [
      { question: "Does this support high Roman numerals?", answer: "Yes! Our conversion engine accurately supports numbers from 1 to 3999, properly formatting numerals like IV (4), IX (9), XL (40), XC (90), CD (400), and CM (900)." },
      { question: "Can it clean up existing numbers or bullets?", answer: "Yes, the 'Clean Existing Numbering' option automatically strips existing dashes, numbers, or symbols before applying your new selected style." },
      { question: "Why is deliverable formatting important on Fiverr?", answer: "Clean, structured custom offers look professional, clearly set client expectations, prevent scope creep, and significantly improve order acceptance rates." },
    ],
  },
];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOLS.find((tool) => tool.slug === slug);
}

export function getToolsByCategory(category: ToolCategory): ToolDefinition[] {
  return TOOLS.filter((tool) => tool.category === category && tool.status === "active");
}

export function getPopularTools(): ToolDefinition[] {
  return TOOLS.filter((tool) => tool.isPopular && tool.status === "active");
}

export function getFeaturedTools(): ToolDefinition[] {
  return TOOLS.filter((tool) => tool.isFeatured && tool.status === "active");
}

export function getRelatedTools(currentSlug: string, limit: number = 4): ToolDefinition[] {
  const current = getToolBySlug(currentSlug);
  if (!current) return [];
  return TOOLS.filter((t) => t.slug !== currentSlug && t.category === current.category && t.status === "active").slice(
    0,
    limit
  );
}

export function searchTools(query: string): ToolDefinition[] {
  const cleanQuery = query.toLowerCase().trim();
  if (!cleanQuery) return [];

  return TOOLS.filter((tool) => {
    if (tool.status !== "active") return false;

    // Check name
    if (tool.name.toLowerCase().includes(cleanQuery)) return true;

    // Check description
    if (tool.description.toLowerCase().includes(cleanQuery)) return true;

    // Check category
    if (tool.category.toLowerCase().includes(cleanQuery)) return true;

    // Check keywords
    if (tool.keywords.some((kw) => kw.toLowerCase().includes(cleanQuery))) return true;

    // Check synonyms
    if (tool.synonyms.some((syn) => syn.toLowerCase().includes(cleanQuery))) return true;

    return false;
  });
}
