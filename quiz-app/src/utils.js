export function mapQuestionKeys(q) {
  return {
    ...q,
    domainId: q.domain_id ?? q.domainId,
    correctAnswer: q.correct_answer ?? q.correctAnswer,
    whyOthersWrong: q.why_others_wrong ?? q.whyOthersWrong,
    docReference: q.doc_reference ?? q.docReference,
    docStatus: q.doc_status ?? q.docStatus,
    skilljarRef: q.skilljar_ref ?? q.skilljarRef,
    courseKeys: q.course_keys ?? q.courseKeys ?? [],
  }
}

export function shuffleArray(arr) {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function prepareQuestionsForQuiz(questions) {
  const letters = ['a', 'b', 'c', 'd']
  return shuffleArray(questions).map(q => {
    const shuffledOpts = shuffleArray(q.options)
    const remapped = shuffledOpts.map((opt, i) => ({ ...opt, id: letters[i] }))
    const newCorrect = remapped.find(o => o.correct)?.id || q.correctAnswer
    const oldToNew = {}
    shuffledOpts.forEach((opt, i) => { oldToNew[opt.id] = letters[i] })
    const newWhyWrong = {}
    if (q.whyOthersWrong) {
      Object.entries(q.whyOthersWrong).forEach(([oldKey, text]) => {
        newWhyWrong[oldToNew[oldKey] || oldKey] = text
      })
    }
    return { ...q, options: remapped, correctAnswer: newCorrect, whyOthersWrong: newWhyWrong }
  })
}
