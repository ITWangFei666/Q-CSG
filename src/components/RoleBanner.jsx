import { useOutletContext } from 'react-router-dom'

function RoleBanner({ dayNum }) {
  const { role } = useOutletContext()

  if (!role) return null

  const isFocus = role.focusDays.includes(dayNum)
  const dayValue = role.moduleValues?.[dayNum]

  return (
    <div className={`role-banner ${isFocus ? 'focus' : ''}`}>
      <div className="role-banner-header">
        <span>{role.icon}</span>
        <strong>{role.name}视角</strong>
        {isFocus && <span className="tag tag-focus">⭐ 核心模块</span>}
      </div>
      {dayValue && <p className="role-banner-value">{dayValue}</p>}
    </div>
  )
}

export default RoleBanner
