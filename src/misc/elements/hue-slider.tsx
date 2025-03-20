import { useCallback } from "preact/hooks";
import "./hue-slider.css";

type GradientSliderProps = {
    value: number;
    gradient?: string[];
    backgroundImage?: string;
    onChange?: (value: number) => void;
};
export function GradientSlider({value, gradient, backgroundImage, onChange}: GradientSliderProps) {

    const background = [
        gradient && `linear-gradient(to right, ${gradient.join(',')})`,
        backgroundImage && `url(${backgroundImage})`, 
    ].filter(v => !!v).join(',');

    const style = gradient && {backgroundImage: background};

    const changeHandler = useCallback((e: Event) => {
        value = parseFloat((e.target as HTMLInputElement).value) / 1000.0;
        onChange && onChange(value);
    }, [onChange]);

    const v = (value * 1000.0).toFixed(0);

    return <input class={'hue-range'} style={style} 
        value={v} onChange={changeHandler} type={'range'} min={0} max={1000} />
}