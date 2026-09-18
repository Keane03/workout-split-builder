import { USING_MOCK_API } from '../api'

export default function DemoNotice() {
  if (!USING_MOCK_API) return null

  return (
    <div className="demo-notice" role="status">
      <strong>Demo mode.</strong> Your workouts, schedule, and profile are saved
      in this browser only. No server or database is connected yet; the future
      Express API can use the same interface when it is implemented.
    </div>
  )
}
