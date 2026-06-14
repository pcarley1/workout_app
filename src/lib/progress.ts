type SessionForProgress = {
  totalDurationMin: number | null;
  difficulty: number | null;
  golfFeelLog: {
    rotation: number;
    shallowing: number;
    posture: number;
    speedFeel: number;
  } | null;
};

function average(values: number[]) {
  if (values.length === 0) return 0;

  return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10;
}

export function summarizeProgress(sessions: SessionForProgress[]) {
  const feelLogs = sessions
    .map((session) => session.golfFeelLog)
    .filter((log): log is NonNullable<SessionForProgress["golfFeelLog"]> => log !== null);

  return {
    workoutsCompleted: sessions.length,
    trainingMinutes: sessions.reduce((sum, session) => sum + (session.totalDurationMin ?? 0), 0),
    averageDifficulty: average(sessions.map((session) => session.difficulty).filter((value): value is number => value !== null)),
    averageRotation: average(feelLogs.map((log) => log.rotation)),
    averageShallowing: average(feelLogs.map((log) => log.shallowing)),
    averagePosture: average(feelLogs.map((log) => log.posture)),
    averageSpeedFeel: average(feelLogs.map((log) => log.speedFeel))
  };
}
