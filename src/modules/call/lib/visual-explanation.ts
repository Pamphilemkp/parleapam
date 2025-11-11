export type VisualExplanationType =
  | 'concept'
  | 'flowchart'
  | 'equation'
  | 'comparison'
  | 'timeline'
  | 'list';

export interface VisualExplanationItem {
  id: string;
  label: string;
  detail?: string;
}

export interface VisualExplanationData {
  type: VisualExplanationType;
  title: string;
  summary?: string;
  items?: VisualExplanationItem[];
  connections?: Array<{ from: string; to: string; label?: string }>;
  equation?: string;
  steps?: Array<{ label: string; description?: string }>;
}

const KEYWORD_GROUPS: Array<{ keywords: string[]; type: VisualExplanationType }> = [
  { keywords: ['flow', 'process', 'pipeline', 'step-by-step', 'workflow'], type: 'flowchart' },
  { keywords: ['equation', 'formula', '=', 'law', 'calculate'], type: 'equation' },
  { keywords: ['compare', 'difference', 'vs', 'versus', 'advantages'], type: 'comparison' },
  { keywords: ['timeline', 'chronology', 'history', 'evolution'], type: 'timeline' },
  { keywords: ['list', 'bullets', 'points', 'key takeaways'], type: 'list' },
];

function guessTypeFromText(text: string): VisualExplanationType {
  const normalized = text.toLowerCase();
  for (const group of KEYWORD_GROUPS) {
    if (group.keywords.some((keyword) => normalized.includes(keyword))) {
      return group.type;
    }
  }

  const hasEquationSymbols = /[=\^+\-÷×/*]/.test(text);
  if (hasEquationSymbols) {
    return 'equation';
  }

  const hasArrows = /->|→/.test(text);
  if (hasArrows) {
    return 'flowchart';
  }

  return 'concept';
}

export function deriveVisualExplanation(text: string): VisualExplanationData | null {
  if (!text || text.trim().length === 0) {
    return null;
  }

  const type = guessTypeFromText(text);
  const title = extractTitle(text, type);

  switch (type) {
    case 'equation':
      return {
        type,
        title,
        equation: extractEquation(text),
        summary: extractSummary(text),
      };
    case 'flowchart':
      return buildFlowchart(text, title);
    case 'comparison':
      return buildComparison(text, title);
    case 'timeline':
      return buildTimeline(text, title);
    case 'list':
      return buildList(text, title);
    default:
      return buildConceptMap(text, title);
  }
}

function extractTitle(text: string, type: VisualExplanationType): string {
  const firstSentence = text.split(/\.|\n/)[0]?.trim();
  if (firstSentence) {
    return capitalize(firstSentence.slice(0, 120));
  }

  switch (type) {
    case 'equation':
      return 'Key Equation';
    case 'flowchart':
      return 'Process Overview';
    case 'comparison':
      return 'Comparison';
    case 'timeline':
      return 'Timeline';
    case 'list':
      return 'Key Points';
    default:
      return 'Concept Breakdown';
  }
}

function extractEquation(text: string): string {
  const equationMatch = text.match(/([A-Za-z0-9\s]+=[^\n]+)/);
  if (equationMatch) {
    return equationMatch[0].trim();
  }

  const simpleMatch = text.match(/([Ff]orce|[Mm]ass|[Aa]cceleration|[Ee]nergy|[Pp]ower).*=/);
  if (simpleMatch) {
    return simpleMatch[0].trim();
  }

  return text.split(/\n/)[0] ?? 'Equation';
}

function extractSummary(text: string): string | undefined {
  const sentences = text.split(/\.|\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  return sentences.slice(1, 3).join('. ');
}

function buildFlowchart(text: string, title: string): VisualExplanationData {
  const steps = splitIntoSentences(text).slice(0, 5);
  const items = steps.map((step, index) => ({
    id: `step-${index}`,
    label: capitalize(step),
  }));

  const connections = items
    .slice(0, -1)
    .map((item, index) => ({ from: item.id, to: items[index + 1].id }));

  return {
    type: 'flowchart',
    title,
    items,
    connections,
  };
}

function buildComparison(text: string, title: string): VisualExplanationData {
  const halves = text.split(/\bvs\b|versus|compare/i);
  if (halves.length < 2) {
    return buildConceptMap(text, title);
  }

  const leftItems = splitIntoSentences(halves[0]).slice(0, 3);
  const rightItems = splitIntoSentences(halves[1]).slice(0, 3);

  return {
    type: 'comparison',
    title,
    items: [
      ...leftItems.map((label, index) => ({ id: `left-${index}`, label: capitalize(label), detail: 'Option A' })),
      ...rightItems.map((label, index) => ({ id: `right-${index}`, label: capitalize(label), detail: 'Option B' })),
    ],
  };
}

function buildTimeline(text: string, title: string): VisualExplanationData {
  const sentences = splitIntoSentences(text).slice(0, 5);
  return {
    type: 'timeline',
    title,
    steps: sentences.map((sentence, index) => ({
      label: `${index + 1}`,
      description: capitalize(sentence),
    })),
  };
}

function buildList(text: string, title: string): VisualExplanationData {
  const sentences = splitIntoSentences(text).slice(0, 6);
  return {
    type: 'list',
    title,
    items: sentences.map((sentence, index) => ({
      id: `point-${index}`,
      label: capitalize(sentence),
    })),
  };
}

function buildConceptMap(text: string, title: string): VisualExplanationData {
  const sentences = splitIntoSentences(text).slice(0, 5);
  return {
    type: 'concept',
    title,
    items: sentences.map((sentence, index) => ({
      id: `concept-${index}`,
      label: capitalize(sentence),
    })),
  };
}

function splitIntoSentences(text: string): string[] {
  return text
    .split(/\.|\n|•|-/)
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 3);
}

function capitalize(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}


