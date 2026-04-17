const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'quiz-app', 'src', 'data');
const seedsDir = path.join(__dirname, '..', 'backend', 'seeds');

function camelToSnake(str) {
  return str.replace(/[A-Z]/g, m => '_' + m.toLowerCase());
}

function convertKeys(obj) {
  if (Array.isArray(obj)) return obj.map(convertKeys);
  if (obj && typeof obj === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      out[camelToSnake(k)] = convertKeys(v);
    }
    return out;
  }
  return obj;
}

// Extract array from JS export file
function extractArray(filePath) {
  let src = fs.readFileSync(filePath, 'utf8');
  // Remove export statement
  src = src.replace(/export\s+const\s+\w+\s*=\s*/, 'module.exports = ');
  // Write to temp file and require
  const tmp = filePath + '.tmp.cjs';
  fs.writeFileSync(tmp, src);
  try {
    delete require.cache[require.resolve(tmp)];
    return require(tmp);
  } finally {
    fs.unlinkSync(tmp);
  }
}

// Extract object (for summaries)
function extractObject(filePath) {
  let src = fs.readFileSync(filePath, 'utf8');
  src = src.replace(/export\s+const\s+\w+\s*=\s*/, 'module.exports = ');
  const tmp = filePath + '.tmp.cjs';
  fs.writeFileSync(tmp, src);
  try {
    delete require.cache[require.resolve(tmp)];
    return require(tmp);
  } finally {
    fs.unlinkSync(tmp);
  }
}

// --- Convert Questions ---
console.log('Converting questions...');
const questionFiles = [
  'questions.js', 'questions_part2.js', 'questions_part3.js',
  'questions_part4.js', 'questions_part5.js', 'questions_part6.js'
];

const allQuestions = [];
for (const file of questionFiles) {
  const filePath = path.join(dataDir, file);
  const data = extractArray(filePath);
  allQuestions.push(...data);
}

const questionsJson = allQuestions.map(q => {
  const out = {
    id: q.id,
    domain_id: q.domainId,
    domain: q.domain,
    scenario: q.scenario || '',
    question: q.question,
    options: q.options,
    correct_answer: q.correctAnswer,
    explanation: q.explanation || '',
    why_others_wrong: q.whyOthersWrong || {},
    doc_reference: q.docReference || null,
    doc_status: q.docStatus || null,
    skilljar_ref: q.skilljarRef || null,
  };
  return out;
});

fs.writeFileSync(
  path.join(seedsDir, 'questions.json'),
  JSON.stringify(questionsJson, null, 2)
);
console.log(`  Wrote ${questionsJson.length} questions`);

// --- Convert Topics ---
console.log('Converting topics...');
const topics = extractArray(path.join(dataDir, 'learnTopics.js'));
const summaries = extractObject(path.join(dataDir, 'learnSummaries.js'));

const topicsJson = topics.map(t => {
  const s = summaries[t.id];
  return {
    id: t.id,
    domain_id: t.domainId,
    domain: t.domain || '',
    title: t.title,
    content: t.content || '',
    doc_url: t.docUrl || null,
    doc_label: t.docLabel || null,
    related_topics: t.relatedTopics || [],
    skilljar_refs: t.skilljarRefs || null,
    anthropic_docs_ref: t.anthropicDocsRef || null,
    summary: s ? s.summary : null,
    key_concepts: s ? (s.keyConcepts || []) : [],
  };
});

fs.writeFileSync(
  path.join(seedsDir, 'learn_topics.json'),
  JSON.stringify(topicsJson, null, 2)
);
console.log(`  Wrote ${topicsJson.length} topics`);

console.log('Done!');
