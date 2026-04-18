import { useState, useCallback, useEffect, useMemo, memo } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  MarkerType,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import dagre from 'dagre'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { api } from '../api'

// Topic mapper for snake_case → camelCase conversion
function mapTopicKeys(t) {
  return {
    ...t,
    domainId: t.domain_id ?? t.domainId,
    docUrl: t.doc_url ?? t.docUrl,
    docLabel: t.doc_label ?? t.docLabel,
    relatedTopics: t.related_topics ?? t.relatedTopics,
    skilljarRefs: t.skilljar_refs ?? t.skilljarRefs,
    anthropicDocsRef: t.anthropic_docs_ref ?? t.anthropicDocsRef,
    keyConcepts: t.key_concepts ?? t.keyConcepts,
  }
}

const DOMAIN_COLORS = {
  1: '#f97316',
  2: '#06b6d4',
  3: '#8b5cf6',
  4: '#10b981',
  5: '#ec4899',
}

const DOMAIN_LABELS = {
  1: 'Agentic Architecture',
  2: 'Tool Design & MCP',
  3: 'Claude Code Config',
  4: 'Prompt Engineering',
  5: 'Context Management',
}

const NODE_WIDTH = 220
const NODE_HEIGHT = 68

// Directed prerequisite edges: source is the prerequisite, target depends on it.
// We define explicit learning-order edges rather than using the bidirectional relatedTopics.
const PREREQUISITE_EDGES = [
  // D1 internal flow
  ['d1-agentic-loop', 'd1-tool-use-contract'],
  ['d1-agentic-loop', 'd1-hooks'],
  ['d1-tool-use-contract', 'd1-tool-categories'],
  ['d1-tool-categories', 'd1-workflow-patterns'],
  ['d1-workflow-patterns', 'd1-subagent-config'],
  ['d1-subagent-config', 'd1-multi-agent'],
  ['d1-hooks', 'd1-programmatic-enforcement'],
  ['d1-tool-categories', 'd1-programmatic-enforcement'],

  // D2 internal flow
  ['d2-tool-interfaces', 'd2-tool-choice'],
  ['d2-tool-interfaces', 'd2-strict-tool-use'],
  ['d2-tool-interfaces', 'd2-error-responses'],
  ['d2-tool-interfaces', 'd2-mcp-architecture'],
  ['d2-tool-interfaces', 'd2-builtin-tools'],
  ['d2-mcp-architecture', 'd2-mcp-transports'],
  ['d2-mcp-transports', 'd2-mcp-config'],

  // D3 internal flow
  ['d3-claude-md', 'd3-rules'],
  ['d3-claude-md', 'd3-skills'],
  ['d3-claude-md', 'd3-plan-mode'],
  ['d3-claude-md', 'd3-settings'],
  ['d3-plan-mode', 'd3-cli'],
  ['d3-cli', 'd3-cicd'],
  ['d3-cli', 'd3-agent-sdk'],

  // D4 internal flow
  ['d4-prompting-best-practices', 'd4-few-shot'],
  ['d4-prompting-best-practices', 'd4-structured-output'],
  ['d4-prompting-best-practices', 'd4-adaptive-thinking'],
  ['d4-prompting-best-practices', 'd4-multi-instance-review'],
  ['d4-prompting-best-practices', 'd4-messages-api'],
  ['d4-structured-output', 'd4-batch-processing'],

  // D5 internal flow
  ['d5-context-windows', 'd5-context-strategies'],
  ['d5-context-windows', 'd5-provenance'],
  ['d5-context-windows', 'd5-subagent-context'],
  ['d5-context-strategies', 'd5-state-persistence'],
  ['d5-context-strategies', 'd5-escalation'],
  ['d5-escalation', 'd5-error-propagation'],

  // Cross-domain prerequisites
  ['d1-tool-use-contract', 'd2-tool-interfaces'],
  ['d1-tool-use-contract', 'd2-error-responses'],
  ['d1-hooks', 'd3-agent-sdk'],
  ['d2-tool-choice', 'd4-structured-output'],
  ['d2-tool-choice', 'd4-adaptive-thinking'],
  ['d1-subagent-config', 'd5-subagent-context'],
  ['d1-multi-agent', 'd5-error-propagation'],
  ['d4-multi-instance-review', 'd5-escalation'],
]

function buildGraph(completed, learnTopics) {
  const topicIds = new Set(learnTopics.map((t) => t.id))

  const g = new dagre.graphlib.Graph()
  g.setGraph({
    rankdir: 'TB',
    nodesep: 60,
    ranksep: 90,
    marginx: 40,
    marginy: 40,
  })
  g.setDefaultEdgeLabel(() => ({}))

  learnTopics.forEach((t) => {
    g.setNode(t.id, { width: NODE_WIDTH, height: NODE_HEIGHT })
  })

  const edges = []
  const edgeSet = new Set()

  PREREQUISITE_EDGES.forEach(([src, tgt]) => {
    if (!topicIds.has(src) || !topicIds.has(tgt)) return
    const key = `${src}->${tgt}`
    if (edgeSet.has(key)) return
    edgeSet.add(key)

    g.setEdge(src, tgt)

    const srcTopic = learnTopics.find((t) => t.id === src)
    const tgtTopic = learnTopics.find((t) => t.id === tgt)
    const crossDomain = srcTopic.domainId !== tgtTopic.domainId

    const color = crossDomain
      ? 'rgba(100,116,139,0.2)'
      : DOMAIN_COLORS[srcTopic.domainId] + '44'

    edges.push({
      id: `e-${src}-${tgt}`,
      source: src,
      target: tgt,
      type: 'default',
      animated: !crossDomain,
      style: { stroke: color, strokeWidth: crossDomain ? 1 : 1.5 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color,
        width: 12,
        height: 12,
      },
    })
  })

  dagre.layout(g)

  const nodes = learnTopics.map((t) => {
    const pos = g.node(t.id)
    return {
      id: t.id,
      type: 'topicNode',
      position: { x: pos.x - NODE_WIDTH / 2, y: pos.y - NODE_HEIGHT / 2 },
      data: {
        label: t.title,
        domainId: t.domainId,
        topicId: t.id,
        completed: completed.includes(t.id),
      },
    }
  })

  return { nodes, edges }
}

const TopicNode = memo(function TopicNode({ data }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const color = DOMAIN_COLORS[data.domainId]
  const completed = data.completed

  const handleClick = useCallback(() => {
    navigate(`/learn/${data.topicId}`)
  }, [navigate, data.topicId])

  const handleCheck = useCallback(
    (e) => {
      e.stopPropagation()
      window.dispatchEvent(
        new CustomEvent('roadmap-toggle', { detail: data.topicId })
      )
    },
    [data.topicId]
  )

  return (
    <div
      onClick={handleClick}
      style={{
        width: NODE_WIDTH,
        minHeight: NODE_HEIGHT,
        background: completed ? '#0f1128' : '#12122a',
        borderRadius: 10,
        border: `1px solid ${completed ? '#22c55e44' : '#1e293b'}`,
        borderLeft: `4px solid ${color}`,
        cursor: 'pointer',
        padding: '10px 12px',
        position: 'relative',
        opacity: completed ? 0.7 : 1,
        transition: 'box-shadow 0.25s, opacity 0.25s, transform 0.2s',
        boxShadow: 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 18px ${color}44, 0 0 4px ${color}33`
        e.currentTarget.style.transform = 'scale(1.04)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'scale(1)'
      }}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />

      <div
        style={{
          display: 'inline-block',
          fontSize: 9,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: '#fff',
          background: color + '33',
          border: `1px solid ${color}55`,
          borderRadius: 999,
          padding: '1px 8px',
          marginBottom: 4,
        }}
      >
        D{data.domainId}
      </div>

      <div
        style={{
          color: '#f1f5f9',
          fontSize: 12,
          fontWeight: 500,
          lineHeight: 1.3,
          paddingRight: user ? 22 : 0,
        }}
      >
        {data.label}
      </div>

      {user && (
        <div
          onClick={handleCheck}
          style={{
            position: 'absolute',
            top: 10,
            right: 8,
            width: 20,
            height: 20,
            borderRadius: 4,
            border: completed ? 'none' : '2px solid #334155',
            background: completed ? '#22c55e' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background 0.2s, border-color 0.2s',
          }}
        >
          {completed && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 6l3 3 5-5"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      )}

      {completed && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 10,
            background: 'rgba(34,197,94,0.06)',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  )
})

const nodeTypes = { topicNode: TopicNode }

function Legend({ completed, learnTopics }) {
  const total = learnTopics.length
  const done = completed.length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <div
      style={{
        position: 'absolute',
        top: 12,
        right: 12,
        background: '#12122aee',
        border: '1px solid #1e293b',
        borderRadius: 10,
        padding: '14px 16px',
        zIndex: 10,
        minWidth: 180,
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#94a3b8',
          marginBottom: 10,
        }}
      >
        Domains
      </div>
      {[1, 2, 3, 4, 5].map((dId) => {
        const domainTopics = learnTopics.filter((t) => t.domainId === dId)
        const domainDone = domainTopics.filter((t) =>
          completed.includes(t.id)
        ).length
        return (
          <div
            key={dId}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 5,
              fontSize: 11,
              color: '#cbd5e1',
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 3,
                background: DOMAIN_COLORS[dId],
                flexShrink: 0,
              }}
            />
            <span style={{ flex: 1 }}>{DOMAIN_LABELS[dId]}</span>
            <span style={{ color: '#64748b', fontSize: 10 }}>
              {domainDone}/{domainTopics.length}
            </span>
          </div>
        )
      })}
      <div
        style={{
          marginTop: 10,
          paddingTop: 8,
          borderTop: '1px solid #1e293b',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>
          Progress
        </span>
        <span style={{ fontSize: 13, color: '#f1f5f9', fontWeight: 700 }}>
          {done}/{total}{' '}
          <span style={{ fontSize: 10, color: '#64748b' }}>({pct}%)</span>
        </span>
      </div>
      <div
        style={{
          marginTop: 6,
          height: 4,
          borderRadius: 2,
          background: '#1e293b',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            borderRadius: 2,
            background: 'linear-gradient(90deg, #22c55e, #10b981)',
            transition: 'width 0.4s ease',
          }}
        />
      </div>
    </div>
  )
}

export default function RoadmapScreen() {
  const { user } = useAuth()
  const [completed, setCompleted] = useState([])
  const [learnTopics, setLearnTopics] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getTopics()
      .then(data => setLearnTopics(data.map(mapTopicKeys)))
      .catch(err => console.error('Failed to load topics:', err))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!user) {
      setCompleted([])
      return
    }
    api.getProgress()
      .then(items => setCompleted(items.map(p => p.topic_id)))
      .catch(() => {})
  }, [user])

  useEffect(() => {
    function handleToggle(e) {
      const topicId = e.detail
      if (!user) return
      api.toggleProgress(topicId)
        .then(items => setCompleted(items.map(p => p.topic_id)))
        .catch(() => {})
    }
    window.addEventListener('roadmap-toggle', handleToggle)
    return () => window.removeEventListener('roadmap-toggle', handleToggle)
  }, [user])

  const { nodes, edges } = useMemo(() => buildGraph(completed, learnTopics), [completed, learnTopics])

  const minimapNodeColor = useCallback((node) => {
    return DOMAIN_COLORS[node.data?.domainId] || '#334155'
  }, [])

  if (loading) {
    return (
      <div style={{ width: '100%', height: 'calc(100vh - 56px)', background: '#06060f', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="loading-spinner" />
        <span style={{ marginLeft: 12, color: '#94a3b8' }}>Loading roadmap...</span>
      </div>
    )
  }

  return (
    <div
      style={{
        width: '100%',
        height: 'calc(100vh - 56px)',
        background: '#06060f',
        position: 'relative',
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        style={{ background: '#06060f' }}
      >
        <Background variant="dots" gap={24} size={1} color="#1e293b44" />
        <Controls
          showInteractive={false}
          style={{
            background: '#12122a',
            border: '1px solid #1e293b',
            borderRadius: 8,
          }}
        />
        <MiniMap
          nodeColor={minimapNodeColor}
          maskColor="rgba(6,6,15,0.85)"
          style={{
            background: '#0c0c1e',
            border: '1px solid #1e293b',
            borderRadius: 8,
          }}
          pannable
          zoomable
        />
      </ReactFlow>

      <Legend completed={completed} learnTopics={learnTopics} />
    </div>
  )
}
