import { useState, useEffect } from 'react'
import { api } from '../api/client'

const ADMIN_PWD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'
const TABS = [
  { key: 'overview', label: '数据总览' },
  { key: 'users', label: '用户列表' },
  { key: 'records', label: '答题明细' },
  { key: 'weakness', label: '薄弱点分析' },
  { key: 'daystats', label: '各 Day 统计' },
]

function Admin() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(() => !!sessionStorage.getItem('qcsg_admin_auth'))
  const getTabFromHash = () => {
    const tab = window.location.hash.replace('#', '')
    return TABS.some(t => t.key === tab) ? tab : 'overview'
  }
  const [activeTab, setActiveTab] = useState(getTabFromHash)
  const [data, setData] = useState(null)
  const [users, setUsers] = useState(null)
  const [records, setRecords] = useState(null)
  const [recordsPage, setRecordsPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Load dashboard data
  useEffect(() => {
    if (!authed) return
    setLoading(true)
    api.getAdminDashboard(ADMIN_PWD)
      .then((res) => {
        if (res.code === 0) setData(res.data)
        else setError(res.message || '加载失败')
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [authed])

  // Load users when tab changes
  useEffect(() => {
    if (!authed || activeTab !== 'users' || users !== null) return
    setLoading(true)
    api.getAdminUsers(ADMIN_PWD)
      .then((res) => {
        if (res.code === 0) setUsers(res.data)
      })
      .finally(() => setLoading(false))
  }, [authed, activeTab, users])

  // Load records when tab changes
  useEffect(() => {
    if (!authed || activeTab !== 'records') return
    setLoading(true)
    api.getAdminRecords(ADMIN_PWD, recordsPage, 50)
      .then((res) => {
        if (res.code === 0) setRecords(res.data)
      })
      .finally(() => setLoading(false))
  }, [authed, activeTab, recordsPage])

  const handleLogin = () => {
    if (password === ADMIN_PWD) {
      sessionStorage.setItem('qcsg_admin_auth', '1')
      setAuthed(true)
    } else {
      alert('密码错误')
    }
  }

  if (!authed) {
    return (
      <div className="admin-page">
        <div className="admin-login">
          <h1>管理后台</h1>
          <p>输入密码查看学习数据</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="请输入密码"
            className="admin-login-input"
          />
          <button className="btn btn-primary" onClick={handleLogin}>
            进入
          </button>
        </div>
      </div>
    )
  }

  if (loading && !data) return <div className="admin-page"><p className="admin-loading">加载中...</p></div>
  if (error) return <div className="admin-page"><p className="admin-error">错误：{error}</p></div>
  if (!data) return <div className="admin-page"><p className="admin-loading">暂无数据</p></div>

  return (
    <div className="admin-layout">
      {/* 左侧导航 */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>管理后台</h2>
          <p>Q-CSG 学习数据</p>
        </div>
        <nav className="admin-sidebar-nav">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`admin-sidebar-item ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => { setActiveTab(tab.key); window.location.hash = tab.key }}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <a href="/" className="admin-back">← 返回课程</a>
        </div>
      </aside>

      {/* 主内容 */}
      <main className="admin-main">
        {activeTab === 'overview' && <OverviewTab data={data} />}
        {activeTab === 'users' && <UsersTab users={users} loading={loading} />}
        {activeTab === 'records' && <RecordsTab records={records} loading={loading} page={recordsPage} onPageChange={setRecordsPage} />}
        {activeTab === 'weakness' && <WeaknessTab data={data} />}
        {activeTab === 'daystats' && <DayStatsTab data={data} />}
      </main>
    </div>
  )
}

// ── 数据总览 ──
function OverviewTab({ data }) {
  const { totalAttempts, totalCorrect, totalUsers, dayStats, weaknesses } = data
  const overallAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0

  return (
    <>
      <div className="admin-main-header">
        <h1>数据总览</h1>
      </div>

      <div className="admin-cards">
        <div className="admin-card">
          <div className="admin-card-value">{totalAttempts}</div>
          <div className="admin-card-label">总答题人次</div>
        </div>
        <div className="admin-card">
          <div className="admin-card-value">{overallAccuracy}%</div>
          <div className="admin-card-label">总正确率</div>
        </div>
        <div className="admin-card">
          <div className="admin-card-value">{totalUsers}</div>
          <div className="admin-card-label">学习用户数</div>
        </div>
      </div>

      <section className="admin-section">
        <h2>各 Day 答题统计</h2>
        <DayChart dayStats={dayStats} />
      </section>

      <section className="admin-section">
        <h2>薄弱点 TOP 10</h2>
        <WeaknessList weaknesses={weaknesses} />
      </section>
    </>
  )
}

// ── 用户列表 ──
function UsersTab({ users, loading }) {
  if (loading) return <p className="admin-loading">加载用户数据中...</p>
  if (!users || users.length === 0) return <p className="admin-empty">暂无用户数据</p>

  return (
    <>
      <div className="admin-main-header">
        <h1>用户列表</h1>
        <span className="admin-pagination-info">共 {users.length} 人</span>
      </div>

      <section className="admin-section">
        <div className="admin-errors-table-wrap">
          <table className="admin-errors-table">
            <thead>
              <tr>
                <th>用户 ID</th>
                <th>首次访问</th>
                <th>答题次数</th>
                <th>正确率</th>
                <th>完成 Day 数</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.user_id}>
                  <td className="admin-cell-user" title={u.user_id}>
                    {u.user_id === 'anonymous' ? '历史匿名' : u.user_id}
                  </td>
                  <td className="admin-cell-time">{u.first_visit?.slice(0, 16).replace('T', ' ')}</td>
                  <td>{u.total_attempts}</td>
                  <td>{u.accuracy}%</td>
                  <td>{u.days_completed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

// ── 答题明细 ──
function RecordsTab({ records, loading, page, onPageChange }) {
  if (loading) return <p className="admin-loading">加载答题数据中...</p>
  if (!records || records.records.length === 0) return <p className="admin-empty">暂无答题记录</p>

  const totalPages = Math.ceil(records.total / records.page_size)

  return (
    <>
      <div className="admin-main-header">
        <h1>答题明细</h1>
        <span className="admin-pagination-info">共 {records.total} 条</span>
      </div>

      <section className="admin-section">
        <div className="admin-errors-table-wrap">
          <table className="admin-errors-table">
            <thead>
              <tr>
                <th>时间</th>
                <th>用户</th>
                <th>Day</th>
                <th>题目</th>
                <th>用户答案</th>
                <th>是否正确</th>
              </tr>
            </thead>
            <tbody>
              {records.records.map((r) => (
                <tr key={r.id}>
                  <td className="admin-cell-time">{r.created_at?.slice(0, 16).replace('T', ' ')}</td>
                  <td className="admin-cell-user" title={r.user_id}>
                    {r.user_id === 'anonymous' ? '历史匿名' : r.user_id}
                  </td>
                  <td>Day {r.day}</td>
                  <td className="admin-cell-q">{r.question?.slice(0, 50)}{r.question?.length > 50 ? '…' : ''}</td>
                  <td className="admin-cell-answer">{r.user_answer?.slice(0, 40)}</td>
                  <td>
                    {r.correct
                      ? <span style={{ color: '#16a34a', fontWeight: 600 }}>正确</span>
                      : <span style={{ color: '#dc2626', fontWeight: 600 }}>错误</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="admin-pagination">
          <button
            className="admin-pagination-btn"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            上一页
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            let p = i + 1
            if (totalPages > 5 && page > 3) {
              p = page - 2 + i
              if (p > totalPages) p = totalPages - (4 - i)
            }
            return (
              <button
                key={p}
                className={`admin-pagination-btn ${p === page ? 'active' : ''}`}
                onClick={() => onPageChange(p)}
              >
                {p}
              </button>
            )
          })}
          <button
            className="admin-pagination-btn"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            下一页
          </button>
          <span className="admin-pagination-info">第 {page}/{totalPages} 页</span>
        </div>
      </section>
    </>
  )
}

// ── 薄弱点分析 ──
function WeaknessTab({ data }) {
  const { weaknesses } = data
  return (
    <>
      <div className="admin-main-header">
        <h1>薄弱点分析</h1>
      </div>
      <section className="admin-section">
        <h2>薄弱点 TOP 10</h2>
        <WeaknessList weaknesses={weaknesses} />
      </section>
    </>
  )
}

// ── 各 Day 统计 ──
function DayStatsTab({ data }) {
  const { dayStats } = data
  return (
    <>
      <div className="admin-main-header">
        <h1>各 Day 统计</h1>
      </div>
      <section className="admin-section">
        <h2>答题正确率分布</h2>
        <DayChart dayStats={dayStats} />
      </section>
      <section className="admin-section">
        <h2>详细数据</h2>
        <div className="admin-errors-table-wrap">
          <table className="admin-errors-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>答题次数</th>
                <th>正确次数</th>
                <th>正确率</th>
                <th>参与人数</th>
              </tr>
            </thead>
            <tbody>
              {dayStats?.map((s) => {
                const pct = s.total > 0 ? Math.round((s.correct_count / s.total) * 100) : 0
                return (
                  <tr key={s.day}>
                    <td>Day {s.day}</td>
                    <td>{s.total}</td>
                    <td>{s.correct_count}</td>
                    <td>{pct}%</td>
                    <td>{s.user_count} 人</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

// ── 子组件：Day 柱状图 ──
function DayChart({ dayStats }) {
  if (!dayStats || dayStats.length === 0) {
    return <p className="admin-empty">暂无答题数据</p>
  }
  return (
    <div className="admin-day-chart">
      {dayStats.map((s) => {
        const pct = s.total > 0 ? Math.round((s.correct_count / s.total) * 100) : 0
        return (
          <div key={s.day} className="admin-day-bar-wrap">
            <div className="admin-day-bar-label">Day {s.day}</div>
            <div className="admin-day-bar-track">
              <div className="admin-day-bar-fill" style={{ width: `${pct}%` }} />
            </div>
            <div className="admin-day-bar-stats">
              {s.correct_count}/{s.total} ({pct}%) · {s.user_count}人
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── 子组件：薄弱点列表 ──
function WeaknessList({ weaknesses }) {
  if (!weaknesses || weaknesses.length === 0) {
    return <p className="admin-empty">暂无薄弱点数据（全部答对或没有答题记录）</p>
  }
  const maxCount = weaknesses[0]?.count || 1
  return (
    <div className="admin-weak-list">
      {weaknesses.map((w, i) => {
        const pct = Math.round((w.count / maxCount) * 100)
        return (
          <div key={w.tag} className="admin-weak-item">
            <span className="admin-weak-rank">{i + 1}</span>
            <span className="admin-weak-tag">{w.label || w.tag}</span>
            <div className="admin-weak-bar-track">
              <div className="admin-weak-bar-fill" style={{ width: `${pct}%` }} />
            </div>
            <span className="admin-weak-count">{w.count}次</span>
          </div>
        )
      })}
    </div>
  )
}

export default Admin
