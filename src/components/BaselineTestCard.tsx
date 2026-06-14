import { saveBaselineResult } from "../lib/actions";
import { SubmitButton } from "./SubmitButton";

type Props = {
  test: {
    id: string;
    name: string;
    category: string;
    unit: string | null;
    results: Array<{ status: string; numericValue: number | null; recordedAt: Date }>;
  };
};

export function BaselineTestCard({ test }: Props) {
  const latest = test.results[0];

  return (
    <article className="panel">
      <p className="eyebrow">{test.category}</p>
      <h2>{test.name}</h2>
      <p className="muted">{latest ? `Latest: ${latest.status.toLowerCase().replace("_", " ")}` : "Not tested yet"}</p>
      <form action={saveBaselineResult} className="mini-form">
        <input type="hidden" name="baselineTestId" value={test.id} />
        <select name="status" defaultValue="OKAY">
          <option value="NEEDS_WORK">Needs work</option>
          <option value="OKAY">Okay</option>
          <option value="STRONG">Strong</option>
        </select>
        <input name="numericValue" type="number" step="0.1" placeholder={test.unit ?? "value"} />
        <input name="notes" placeholder="Notes" />
        <SubmitButton className="secondary-action" pendingLabel="Saving...">Save</SubmitButton>
      </form>
    </article>
  );
}
