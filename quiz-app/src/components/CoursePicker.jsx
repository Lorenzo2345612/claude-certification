import { PUBLISHED_COURSES, DOCS_ONLY_KEY } from '../courses'

export default function CoursePicker({
  value,
  onChange,
  includeDocsOnly,
  onIncludeDocsOnlyChange,
  label = 'Course',
}) {
  return (
    <div className="course-picker">
      <div className="config-label">{label}</div>
      <select
        className="course-picker-select"
        value={value || ''}
        onChange={e => onChange(e.target.value || null)}
      >
        <option value="">Any course</option>
        {PUBLISHED_COURSES.map(c => (
          <option key={c.key} value={c.key}>{c.displayName}</option>
        ))}
        <option value={DOCS_ONLY_KEY}>Anthropic Docs only</option>
      </select>
      {value && value !== DOCS_ONLY_KEY && onIncludeDocsOnlyChange && (
        <label className="course-picker-docs-toggle">
          <input
            type="checkbox"
            checked={!!includeDocsOnly}
            onChange={e => onIncludeDocsOnlyChange(e.target.checked)}
          />
          <span>Include Anthropic Docs–only questions</span>
        </label>
      )}
    </div>
  )
}
