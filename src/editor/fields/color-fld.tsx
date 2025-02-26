import { useEffect, useLayoutEffect, useRef } from "preact/hooks";
import "slider-color-picker";
import { SliderColorPicker } from "slider-color-picker";
import { Color as CesiumColor } from "cesium";

declare module "preact/jsx-runtime" {
    namespace JSX {
        interface IntrinsicElements {
            "slider-color-picker": JSX.HTMLAttributes<SliderColorPicker>;
        }
    }
}

export type ColorFieldProps = {
    value?: CesiumColor;
    label?: string;
    onChange: (value: CesiumColor) => void;
};
export function ColorField({value, label, onChange}: ColorFieldProps) {
    const ref = useRef<SliderColorPicker>(null);

    const onColorChange = (event: Event) => {
        const value = (event.target as HTMLInputElement).value;
        onChange(CesiumColor.fromCssColorString(value));
    };

    useEffect(() => {
        if (ref.current) {
            ref.current.value = value?.toCssHexString() || '';
        }
    }, [value, ref]);

    useLayoutEffect(() => {
        ref.current?.addEventListener("change", onColorChange);
    }, [ref]);

  return (
    <div class="input-container">
        {label && <label>{label}</label>}
        <slider-color-picker
            ref={ref}
            onChange={onColorChange}
        ></slider-color-picker>
    </div>
  );
}