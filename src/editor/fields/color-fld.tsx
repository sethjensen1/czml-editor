import { useCallback, useState } from "preact/hooks";
import { Color as CesiumColor, Color } from "cesium";

import './color-fld.css';
import { GradientSlider } from "../../misc/elements/hue-slider";

import imgUndefColor from '../../assets/undef-color.svg';
import imgChecker from '../../assets/checker-s.png';
import { DebounceInput } from "../../misc/elements/debounced-input";

export type ColorFieldProps = {
    value?: CesiumColor;
    alpha?: boolean;
    label?: string;
    onChange: (value: CesiumColor | undefined) => void;
};
export function ColorField({value, label, alpha, onChange}: ColorFieldProps) {

    // TODO: Use array or object for color state

    const [_h, _s, _l] = value && rgb2hsl(value.red, value.green, value.blue) || [0, 0.5, 0.5];

    const [h, seth] = useState<number>(_h);
    const [s, sets] = useState<number>(_s * 100.0);
    const [l, setl] = useState<number>(_l * 100.0);
    const [a, seta] = useState<number>(value && value.alpha || 1.0);

    const handleH = useCallback((val: number) => {
        seth(val * 360.0);
        onChange && onChange(CesiumColor.fromHsl(val, s / 100.0, l / 100.0))
    }, [s, l, seth, onChange]);

    const handleS = useCallback((val: number) => {
        sets(val * 100.0);
        onChange && onChange(CesiumColor.fromHsl(h / 360.0, val, l / 100.0))
    }, [h, l, sets, onChange]);

    const handleL = useCallback((val: number) => {
        setl(val * 100.0);
        onChange && onChange(CesiumColor.fromHsl(h / 360.0, s / 100.0, val))
    }, [h, s, setl, onChange]);

    const handleA = useCallback((val: number) => {
        seta(val);
        onChange && onChange(CesiumColor.fromHsl(h / 360.0, s / 100.0, l / 100.0).withAlpha(val))
    }, [h, s, l, seta, onChange]);

    const handleTextInput = useCallback((val: string) => {
        if (val === '' || val === 'none' || val === 'undefined') {
            onChange && onChange(undefined);
        }
        
        const newcolor = Color.fromCssColorString(val);
        if (newcolor) {
            onChange && onChange(newcolor);
            
            const [h, s, l] = rgb2hsl(newcolor.red, newcolor.green, newcolor.blue);
            seth(h);
            seth(s);
            seth(l);
            
            seta(newcolor.alpha);
        }
        
    }, [seth, sets, setl, seta, onChange]);

    const sf = `hsl(${h.toFixed(0)}, 0%, ${l.toFixed(2)}%)`;
    const st = `hsl(${h.toFixed(0)}, 100%, ${l.toFixed(2)}%)`;

    const lf = `hsl(${h.toFixed(0)}, ${s.toFixed(2)}%, 0%)`;
    const lm = `hsl(${h.toFixed(0)}, ${s.toFixed(2)}%, 50%)`;
    const lt = `hsl(${h.toFixed(0)}, ${s.toFixed(2)}%, 100%)`;

    const color = CesiumColor.fromHsl(h / 360.0, s / 100.0, l / 100.0);

    const af = `hsla(${h.toFixed(0)}, ${s.toFixed(1)}%, ${l.toFixed(1)}%, 0)`;
    const at = `hsla(${h.toFixed(0)}, ${s.toFixed(1)}%, ${l.toFixed(1)}%, 1)`;

    const previewStyle = {backgroundColor: `hsla(${h.toFixed(0)}, ${s.toFixed(2)}%, ${l.toFixed(2)}%, ${a.toFixed(3)})`};

    return (
    <div class="input-container color-fld button-size-s">
        {label && <label class={'label'}>{label}</label>}

        <div class={'picker-layout'}>
            <div class={'picker-preview-container'}>
                <div class={'checker'}>
                    {value && <div class={'preview'} style={previewStyle}>
                    </div>}
                    {value === undefined && <div class={'preview-none'} >
                        <img src={imgUndefColor}/>
                    </div>}
                </div>
            </div>
            <div class={'picker-sliders'}>
                <GradientSlider value={h / 360.0} onChange={handleH} />
                
                <GradientSlider value={s / 100.0} gradient={[sf, st]}
                    onChange={handleS} />
                
                <GradientSlider value={l / 100.0} gradient={[lf, lm, lt]}
                    onChange={handleL} />
                
                {alpha && <GradientSlider value={a} gradient={[af, at]} 
                    backgroundImage={imgChecker}
                    onChange={handleA} />}

            </div>
        </div>

        <div class={'color-text-input'}>
            <DebounceInput value={value && color?.toCssHexString() || 'undefined'}
                debounceTimeout={500}
                debouncedOnChange={handleTextInput} />
            <button class={'reset-value'} onClick={() => {onChange && onChange(undefined)}}><img src={imgUndefColor}></img></button>
        </div>
        
        <div class="underline"></div>
    </div>
    );
}

function rgb2hsl(r: number, g: number, b: number) {
    let v=Math.max(r,g,b), c=v-Math.min(r,g,b), f=(1-Math.abs(v+v-c-1)); 
    let h= c && ((v==r) ? (g-b)/c : ((v==g) ? 2+(b-r)/c : 4+(r-g)/c)); 
    return [60*(h<0?h+6:h), f ? c/f : 0, (v+v-c)/2];
}