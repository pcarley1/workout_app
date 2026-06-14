type Summary = {
  workoutsCompleted: number;
  trainingMinutes: number;
  averageDifficulty: number;
  averageRotation: number;
  averageShallowing: number;
  averagePosture: number;
  averageSpeedFeel: number;
};

export function ProgressSummary({ summary }: { summary: Summary }) {
  return (
    <section className="metric-grid">
      <div className="metric">
        <span>Workouts</span>
        <strong>{summary.workoutsCompleted}</strong>
      </div>
      <div className="metric">
        <span>Minutes</span>
        <strong>{summary.trainingMinutes}</strong>
      </div>
      <div className="metric">
        <span>Difficulty</span>
        <strong>{summary.averageDifficulty}</strong>
      </div>
      <div className="metric">
        <span>Rotation</span>
        <strong>{summary.averageRotation}</strong>
      </div>
      <div className="metric">
        <span>Shallowing</span>
        <strong>{summary.averageShallowing}</strong>
      </div>
      <div className="metric">
        <span>Posture</span>
        <strong>{summary.averagePosture}</strong>
      </div>
      <div className="metric">
        <span>Speed feel</span>
        <strong>{summary.averageSpeedFeel}</strong>
      </div>
    </section>
  );
}
