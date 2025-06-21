import { config } from 'dotenv';
config();

import '@/ai/flows/grammar-check.ts';
import '@/ai/flows/summarize-flow.ts';
import '@/ai/flows/paraphrase-flow.ts';
import '@/ai/flows/expand-flow.ts';
