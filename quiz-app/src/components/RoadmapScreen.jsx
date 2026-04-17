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
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { api } from '../api'
import { learnTopics } from '../data/learnTopics'

// ── Domain colors ───────────────────────────────────────────
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

const STORAGE_KEY = 'roadmap_completed'
const API_TOPIC_ID = '__roadmap_progress__'

// ── Load / save helpers ─────────────────────────────────────
function loadCompleted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveCompleted(ids) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
}

// ── Layout constants ────────────────────────────────────────
const COL_WIDTH = 300
const ROW_HEIGHT = 100
const NODE_WIDTH = 230
const NODE_HEIGHT = 72
const LEFT_PAD = 60
const TOP_PAD = 40

// ── Build layout positions ──────────────────────────────────
function buildPositions() {
  const byDomain = {}
  learnTopics.forEach((t) => {
    if (!byDomain[t.domainId]) byDomain[t.domainId] = []
    byDomain[t.domainId].push(t)
  })

  const positions = {}
  const domainIds = [1, 2, 3, 4, 5]

  domainIds.forEach((dId, colIdx) => {
    const topics = byDomain[dId] || []
    topics.forEach((t, rowIdx) => {
      positions[t.id] = {
        x: LEFT_PAD + colIdx * COL_WIDTH,
        y: TOP_PAD + rowIdx * ROW_HEIGHT,
      }
    })
  })

  return positions
}

// ── Build nodes & edges ─────────────────────────────────────
function buildGraph(completed) {
  const positions = buildPositions()
  const topicIds = new Set(learnTopics.map((t) => t.id))

  const nodes = learnTopics.map((t) => ({
    id: t.id,
    type: 'topicNode',
    position: positions[t.id],
    data: {
      label: t.title,
      domainId: t.domainId,
      domain: t.domain,
      topicId: t.id,
      completed: completed.includes(t.id),
    },
  }))

  const edgeSet = new Set()
  const edges = []

  learnTopics.forEach((t) => {
    ;(t.relatedTopics || []).forEach((relId) => {
      if (!topicIds.has(relId)) return
      const key = [t.id, relId].sort().join('|')
      if (edgeSet.has(key)) return
      edgeSet.add(key)

      const srcDomain = t.domainId
      const tgtTopic = learnTopics.find((x) => x.id === relId)
      const tgtDomain = tgtTopic?.domainId || srcDomain
      const crossDomain = srcDomain !== tgtDomain

      const color = crossDomain
        ? 'rgba(100,116,139,0.25)'
        : DOMAIN_COLORS[srcDomain] + '55'

      edges.push({
        id: `e-${t.id}-${relId}`,
        source: t.id,
        target: relId,
        type: 'default',
        animated: !crossDomain,
        style: { stroke: color, strokeWidth: crossDomain ? 1 : 1.5 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color,
          width: 14,
          height: 14,
        },
      })
    })
  })

  return { nodes, edges }
}

// ── Custom node component ───────────────────────────────────
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
      // Dispatched via custom event so parent can update state
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
        border: '1px solid #1e293b',
        borderLeft: `4px solid ${color}`,
        cursor: 'pointer',
        padding: '10px 12px',
        position: 'relative',
        opacity: completed ? 0.75 : 1,
        transition: 'box-shadow 0.25s, opacity 0.25s, transform 0.2s',
        boxShadow: 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 16px ${color}44, 0 0 4px ${color}33`
        e.currentTarget.style.transform = 'scale(1.03)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'scale(1)'
      }}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />

      {/* Domain badge */}
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

      {/* Title */}
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

      {/* Checkbox for logged-in users */}
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

      {/* Completed overlay */}
      {completed && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
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

// ── Legend component ────────────────────────────────────────
function Legend({ completed }) {
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
      {/* Progress bar */}
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

// ── Main component ──────────────────────────────────────────
export default function RoadmapScreen() {
  const { user } = useAuth()
  const [completed, setCompleted] = useState(loadCompleted)

  // Persist to API when user is logged in
  const persistToApi = useCallback(
    (ids) => {
      if (!user) return
      api.upsertNote(API_TOPIC_ID, JSON.stringify(ids)).catch(() => {
        // silently ignore API errors
      })
    },
    [user]
  )

  // Listen for toggle events from nodes
  useEffect(() => {
    function handleToggle(e) {
      const topicId = e.detail
      setCompleted((prev) => {
        const next = prev.includes(topicId)
          ? prev.filter((id) => id !== topicId)
          : [...prev, topicId]
        saveCompleted(next)
        persistToApi(next)
        return next
      })
    }
    window.addEventListener('roadmap-toggle', handleToggle)
    return () => window.removeEventListener('roadmap-toggle', handleToggle)
  }, [persistToApi])

  const { nodes, edges } = useMemo(() => buildGraph(completed), [completed])

  const minimapNodeColor = useCallback((node) => {
    return DOMAIN_COLORS[node.data?.domainId] || '#334155'
  }, [])

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
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.3}
        maxZoom={1.8}
        proOptions={{ hideAttribution: true }}
        style={{ background: '#06060f' }}
      >
        <Background
          variant="dots"
          gap={24}
          size={1}
          color="#1e293b44"
        />
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

      <Legend completed={completed} />
    </div>
  )
}
