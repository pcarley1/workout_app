import { createWorkoutSession } from "../lib/actions";

const equipmentOptions = ["bodyweight", "medball", "dumbbells", "bands", "bench", "golf_club", "open_floor"];

export function TodayForm() {
  return (
    <form action={createWorkoutSession} className="grid-form">
      <label>
        Length
        <select name="length" defaultValue="25">
          <option value="15">15 minutes</option>
          <option value="25">25 minutes</option>
          <option value="40">40 minutes</option>
        </select>
      </label>

      <label>
        Focus
        <select name="focus" defaultValue="posture_shallowing">
          <option value="posture_shallowing">Posture / shallowing</option>
          <option value="swing_speed">Swing speed</option>
          <option value="mobility">Mobility</option>
          <option value="strength">Strength</option>
          <option value="recovery">Recovery</option>
          <option value="balanced">Balanced</option>
        </select>
      </label>

      <label>
        Intensity
        <select name="intensity" defaultValue="normal">
          <option value="easy">Easy</option>
          <option value="normal">Normal</option>
          <option value="push">Push</option>
        </select>
      </label>

      <label>
        Energy
        <input name="energy" type="number" min="1" max="5" defaultValue="4" />
      </label>

      <label>
        Soreness
        <input name="soreness" type="number" min="1" max="5" defaultValue="2" />
      </label>

      <fieldset>
        <legend>Equipment</legend>
        {equipmentOptions.map((item) => (
          <label key={item} className="check">
            <input
              type="checkbox"
              name="equipment"
              value={item}
              defaultChecked={item === "bodyweight" || item === "open_floor"}
            />
            {item.replace("_", " ")}
          </label>
        ))}
      </fieldset>

      <label>
        Pain flags
        <input name="painFlags" placeholder="left hip, low back" />
      </label>

      <button type="submit">Start guided workout</button>
    </form>
  );
}
