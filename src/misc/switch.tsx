import './switch.css';

export type SwitchProps = {
    checked: boolean;
    onChange: (e: Event) => void;
}
export default function Switch ({checked, onChange}: SwitchProps) {
    return (
        <label className="switch">
          <input type="checkbox" checked={checked} onChange={onChange} />
          <span className="slider" />
        </label>
    );
  }