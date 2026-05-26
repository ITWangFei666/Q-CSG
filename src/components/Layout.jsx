import { useState } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { roleStore } from '../store/roleStore'
import { progressStore } from '../store/progressStore'
import { APP_VERSION } from '../version'

const days = [
  { path: '/day1', num: 1, label: '票种识别' },
  { path: '/day2', num: 2, label: '票面填写' },
  { path: '/day3', num: 3, label: '三种人角色' },
  { path: '/day4', num: 4, label: '现场安措' },
  { path: '/day5', num: 5, label: '工作票终结' },
]

function Layout() {
  const location = useLocation()
  const [role] = useState(() => roleStore.getCurrentRole())
  const focusDays = role?.focusDays || []
  const progress = progressStore.getProgress()

  const getStatusIcon = (dayNum) => {
    const key = `day${dayNum}`
    if (progress.daysCompleted[key]) return '✅'
    return '📖'
  }

  return (
    <div className="app-layout">
      <header className="app-header">
        <NavLink to="/" className="header-brand">
          电力行业工作票系列课程
        </NavLink>
        <div className="header-actions">
          {/* 预留：登录入口 */}
          <span className="header-login-placeholder">登录</span>
        </div>
      </header>

      <div className="app-body">
        <aside className="app-sidebar">
          {role && (
            <div className="sidebar-role">
              <span className="sidebar-role-icon">{role.icon}</span>
              <span className="sidebar-role-name">{role.name}</span>
            </div>
          )}
          <div className="sidebar-title">学习进度</div>
          {days.map((d) => {
            const isActive = location.pathname === d.path
            const isFocus = focusDays.includes(d.num)
            const isCompleted = progress.daysCompleted[`day${d.num}`]
            const score = progress.scores[`day${d.num}`]
            return (
              <NavLink
                key={d.path}
                to={d.path}
                className={({ isActive: linkActive }) =>
                  `sidebar-item ${linkActive ? 'current' : ''} ${isFocus ? 'focus' : ''} ${isCompleted ? 'completed' : ''}`
                }
              >
                <span className={`day-badge ${isFocus ? 'focus-badge' : ''} ${isCompleted ? 'completed-badge' : ''}`}>
                  D{d.num}
                </span>
                <div className="sidebar-item-text">
                  <span className="day-label">{d.label}</span>
                  {isFocus && <span className="focus-dot">⭐</span>}
                  {score != null && <span className="sidebar-score">{score}分</span>}
                  <span className="sidebar-status">{getStatusIcon(d.num)}</span>
                </div>
              </NavLink>
            )
          })}
        </aside>

        <main className="app-main">
          <Outlet context={{ role }} />
        </main>
      </div>

      <footer className="app-footer">
        <span>电力工作票课程应用 — 基于电力行业标准</span>
        <span className="footer-version">{APP_VERSION}</span>
      </footer>
    </div>
  )
}

export default Layout
