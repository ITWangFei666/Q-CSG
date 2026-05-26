import ReviewCenter from '../components/ReviewCenter'
import RoleBanner from '../components/RoleBanner'

function Review() {
  return (
    <div className="day-page day-page-flow">
      <RoleBanner dayNum={0} label="复习中心" />
      <div className="day-flow-container">
        <ReviewCenter />
      </div>
    </div>
  )
}

export default Review
